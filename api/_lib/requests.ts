/**
 * The contact pipeline behind book_meeting and send_message. Every request
 * goes through the same four gates before it reaches Kayne:
 *
 *   1. Checks at submit time: valid input, real mail domain, not blocked,
 *      under the per-IP, per-email and global limits.
 *   2. Email verification: nothing happens until the requester clicks the
 *      link sent to the address they gave.
 *   3. Turnstile on the confirm page, so a bot holding the link still can't
 *      finish.
 *   4. Kayne's approval (meetings) or Kayne's inbox (messages). Only an
 *      approved meeting ever touches the calendar.
 *
 * Confirm and review links open a page with a button, and only the button's
 * POST does anything. Mail scanners like Outlook Safe Links open every link
 * they see, so a GET that acted would confirm requests nobody approved.
 */
import { createHmac, randomBytes, timingSafeEqual } from "node:crypto";
import { resolveMx } from "node:dns/promises";
import { Ratelimit } from "@upstash/ratelimit";
import { booking, limits, meetingUrl, ownerEmail, siteUrl } from "./config.js";
import { createEvent, graphConfigured, sendMail } from "./graph.js";
import { emailHtml, esc } from "./html.js";
import { redis } from "./redis.js";
import { isOpen, weekBounds } from "./slots.js";
import { label } from "./time.js";

export type ContactRequest = {
  id: string;
  kind: "meeting" | "message";
  name: string;
  email: string;
  /** Meeting reason or message body. */
  text: string;
  link?: string;
  slot?: { start: number; end: number };
  ip: string;
  createdAt: number;
  status: "unverified" | "pending" | "approved" | "declined" | "delivered";
};

const key = (id: string) => `req:${id}`;
const PENDING = "req:pending"; // sorted set of verified ids, scored by expiry
const BOOKED = "req:booked"; // sorted set of approved meeting ids, scored by slot start
const BLOCKED = "req:blocked"; // set of lowercased emails

export const pipelineReady = () =>
  Boolean(redis && graphConfigured() && ownerEmail && process.env.TURNSTILE_SECRET_KEY && process.env.REVIEW_SECRET);

/** Throwaway inbox services. Not exhaustive; the MX check and limits catch the rest. */
const DISPOSABLE = new Set([
  "mailinator.com", "guerrillamail.com", "guerrillamail.net", "sharklasers.com", "10minutemail.com",
  "temp-mail.org", "tempmail.com", "yopmail.com", "trashmail.com", "getnada.com", "maildrop.cc",
  "dispostable.com", "throwawaymail.com", "fakeinbox.com", "mailnesia.com", "emailondeck.com",
  "mohmal.com", "tempr.email", "discard.email", "burnermail.io", "mintemail.com", "spamgourmet.com",
]);

async function domainProblem(email: string): Promise<string | null> {
  const domain = email.split("@")[1]?.toLowerCase() ?? "";
  if (DISPOSABLE.has(domain)) return "Disposable email addresses aren't accepted. Please use a real inbox.";
  try {
    const mx = await resolveMx(domain);
    if (mx.length === 0) throw new Error();
  } catch {
    return `The domain ${domain} doesn't accept email. Check the address for typos.`;
  }
  return null;
}

const limiters = redis && {
  ip: new Ratelimit({ redis, limiter: Ratelimit.fixedWindow(limits.perIpPerDay, "1 d"), prefix: "rl:req:ip" }),
  email: new Ratelimit({ redis, limiter: Ratelimit.fixedWindow(limits.perEmailPerDay, "1 d"), prefix: "rl:req:email" }),
  global: new Ratelimit({ redis, limiter: Ratelimit.fixedWindow(limits.verificationEmailsPerDay, "1 d"), prefix: "rl:req:global" }),
};

async function pendingCount(): Promise<number> {
  await redis!.zremrangebyscore(PENDING, 0, Date.now());
  return redis!.zcard(PENDING);
}

async function meetingsInWeekOf(ms: number): Promise<number> {
  const [from, to] = weekBounds(ms);
  return redis!.zcount(BOOKED, from, to - 1);
}

/** A key only Kayne's review email carries, so knowing a request id isn't enough to approve it. */
export const reviewKey = (id: string) => createHmac("sha256", process.env.REVIEW_SECRET!).update(id).digest("hex");

export function validReviewKey(id: string, given: string): boolean {
  const want = Buffer.from(reviewKey(id));
  const got = Buffer.from(given);
  return want.length === got.length && timingSafeEqual(want, got);
}

export async function getRequest(id: string): Promise<ContactRequest | null> {
  if (!/^[a-f0-9]{48}$/.test(id)) return null;
  return redis!.get<ContactRequest>(key(id));
}

async function save(r: ContactRequest, ttlSeconds: number) {
  await redis!.set(key(r.id), r, { ex: ttlSeconds });
}

const when = (r: ContactRequest) => (r.slot ? label(r.slot.start, booking.timeZone) : "");

type Submit = Pick<ContactRequest, "kind" | "name" | "email" | "text" | "link" | "slot" | "ip">;

/**
 * Gate 1, then sends the verification email. Returns a message for the caller
 * either way; it never throws for something the caller did wrong.
 */
export async function submit(input: Submit): Promise<{ ok: boolean; message: string }> {
  if (!pipelineReady()) return { ok: false, message: "Booking and messaging aren't set up on this site yet. Email Kayne directly instead." };

  const email = input.email.trim().toLowerCase();
  if (await redis!.sismember(BLOCKED, email)) {
    return { ok: false, message: "This address can't send requests here." };
  }
  const problem = await domainProblem(email);
  if (problem) return { ok: false, message: problem };

  for (const [limiter, id] of [[limiters!.ip, input.ip], [limiters!.email, email]] as const) {
    if (!(await limiter.limit(id)).success) return { ok: false, message: "Too many requests today. Try again tomorrow." };
  }
  if ((await pendingCount()) >= limits.maxPending) {
    return { ok: false, message: "Kayne has a backlog of requests to get through. Please try again in a few days." };
  }
  if (input.slot) {
    if (!(await isOpen(input.slot.start))) return { ok: false, message: "That time isn't available. Call get_availability for open times." };
    if ((await meetingsInWeekOf(input.slot.start)) >= booking.maxMeetingsPerWeek) {
      return { ok: false, message: "That week is fully booked. Try a time in another week." };
    }
  }
  if (!(await limiters!.global.limit("all")).success) {
    return { ok: false, message: "This site has hit its limit for today. Try again tomorrow." };
  }

  const r: ContactRequest = { ...input, email, id: randomBytes(24).toString("hex"), createdAt: Date.now(), status: "unverified" };
  await save(r, limits.verifyWindowMinutes * 60);

  const what = r.kind === "meeting" ? `a ${booking.slotMinutes} minute call on ${esc(when(r))}` : "a message";
  await sendMail({
    to: email,
    subject: r.kind === "meeting" ? "Confirm your call request with Kayne Lee" : "Confirm your message to Kayne Lee",
    html: emailHtml(
      [
        `Hi ${esc(r.name)},`,
        `Someone (hopefully you) asked to send Kayne Lee ${what} from this address. Click below to confirm it was you.`,
        `The link works for ${limits.verifyWindowMinutes} minutes. If this wasn't you, ignore this email and nothing will be sent.`,
      ],
      { href: `${siteUrl}/api/confirm?id=${r.id}`, text: "Confirm it's me" },
    ),
  });

  return {
    ok: true,
    message:
      `Check ${email} for a confirmation link (valid ${limits.verifyWindowMinutes} minutes). ` +
      (r.kind === "meeting"
        ? "Once confirmed, Kayne reviews the request and a calendar invite follows if it's approved. The time isn't held until then."
        : "Once confirmed, the message goes straight to Kayne."),
  };
}

/** Gates 2 and 3 have passed: mark verified and hand it to Kayne. */
export async function verified(r: ContactRequest): Promise<string> {
  if (r.kind === "meeting" && !(await isOpen(r.slot!.start))) {
    await redis!.del(key(r.id));
    return "Sorry, that time was taken while you were confirming. Please ask for a new time.";
  }

  const review = `${siteUrl}/api/review?id=${r.id}&key=${reviewKey(r.id)}`;
  const details = [
    `<b>From:</b> ${esc(r.name)} &lt;${esc(r.email)}&gt;`,
    ...(r.link ? [`<b>Link:</b> ${esc(r.link)}`] : []),
    ...(r.slot ? [`<b>When:</b> ${esc(when(r))}`] : []),
    `<b>${r.kind === "meeting" ? "Reason" : "Message"}:</b><br>${esc(r.text).replace(/\n/g, "<br>")}`,
  ];

  if (r.kind === "message") {
    // Messages need no approval: they only reach Kayne's inbox. Reply goes straight to the sender.
    await sendMail({
      to: ownerEmail,
      subject: `Message from ${r.name} via your MCP server`,
      html: emailHtml([...details, "Hit reply to answer. If it's junk, block the sender:"], { href: review, text: "Block sender" }),
      replyTo: { name: r.name, email: r.email },
    });
    r.status = "delivered";
    await save(r, limits.reviewWindowDays * 24 * 3600);
    return "Confirmed. Your message is on its way to Kayne.";
  }

  r.status = "pending";
  const ttl = limits.reviewWindowDays * 24 * 3600;
  await save(r, ttl);
  await redis!.zadd(PENDING, { score: Date.now() + ttl * 1000, member: r.id });
  await sendMail({
    to: ownerEmail,
    subject: `Call request from ${r.name}: ${when(r)}`,
    html: emailHtml(details, { href: review, text: "Review request" }),
    replyTo: { name: r.name, email: r.email },
  });
  return "Confirmed. Kayne will review your request, and you'll get a calendar invite if it's approved.";
}

/** Gate 4. Returns what to show Kayne after the click. */
export async function review(r: ContactRequest, action: "approve" | "decline" | "block"): Promise<string> {
  if (action === "block") {
    await redis!.sadd(BLOCKED, r.email);
    await redis!.zrem(PENDING, r.id);
    r.status = "declined";
    await save(r, 24 * 3600);
    return `Blocked ${r.email}. They can't send requests anymore and weren't notified.`;
  }
  if (r.kind !== "meeting" || r.status !== "pending") return "This request has already been handled.";

  await redis!.zrem(PENDING, r.id);

  if (action === "decline") {
    r.status = "declined";
    await save(r, 24 * 3600);
    await sendMail({
      to: r.email,
      subject: "About your call request with Kayne Lee",
      html: emailHtml([
        `Hi ${esc(r.name)},`,
        `Thanks for reaching out. Kayne can't make the call on ${esc(when(r))}, so no invite is coming for it.`,
      ]),
    });
    return `Declined. ${r.name} got a short note saying so.`;
  }

  if (!(await isOpen(r.slot!.start))) {
    r.status = "declined";
    await save(r, 24 * 3600);
    return "That slot is no longer free on your calendar, so nothing was booked. Reply to them by email to pick another time.";
  }
  await createEvent({
    subject: `Kayne Lee <> ${r.name}`,
    html: emailHtml([
      `<b>Reason:</b> ${esc(r.text)}`,
      meetingUrl ? `Join: <a href="${esc(meetingUrl)}">${esc(meetingUrl)}</a>` : "Kayne will send a video link before the call.",
    ]),
    startMs: r.slot!.start,
    endMs: r.slot!.end,
    location: meetingUrl || "Video call",
    attendee: { name: r.name, email: r.email },
  });
  await redis!.zadd(BOOKED, { score: r.slot!.start, member: r.id });
  r.status = "approved";
  await save(r, 24 * 3600);
  return `Booked. ${r.name} has been sent an invite for ${when(r)}.`;
}
