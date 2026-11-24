/**
 * Microsoft Graph, acting as Kayne's own Outlook account: read free/busy,
 * send mail, and create calendar events.
 *
 * Personal (outlook.com) accounts can't use app-only credentials, so this uses
 * a delegated refresh token from `node scripts/oauth.mjs microsoft`.
 */
import { accessToken } from "./oauth.js";

const SCOPE = "offline_access User.Read Calendars.ReadWrite Mail.Send";

const token = () =>
  accessToken({
    name: "microsoft",
    tokenUrl: "https://login.microsoftonline.com/consumers/oauth2/v2.0/token",
    clientId: process.env.MS_CLIENT_ID,
    clientSecret: process.env.MS_CLIENT_SECRET,
    initialRefreshToken: process.env.MS_REFRESH_TOKEN,
    extra: { scope: SCOPE },
  });

export const graphConfigured = () =>
  Boolean(process.env.MS_CLIENT_ID && process.env.MS_CLIENT_SECRET && process.env.MS_REFRESH_TOKEN);

async function graph(path: string, init: RequestInit & { headers?: Record<string, string> } = {}) {
  const t = await token();
  if (!t) throw new Error("Outlook isn't connected");
  const res = await fetch(`https://graph.microsoft.com/v1.0${path}`, {
    ...init,
    headers: { authorization: `Bearer ${t}`, "content-type": "application/json", ...init.headers },
  });
  if (!res.ok) throw new Error(`Graph ${res.status}: ${await res.text()}`);
  return res.status === 202 || res.status === 204 ? null : res.json();
}

type GraphEvent = { start: { dateTime: string }; end: { dateTime: string }; showAs: string; isCancelled: boolean };

/**
 * Busy intervals on Kayne's calendar between two instants. Only start and end
 * are read, never titles or attendees, so nothing private can leak from here.
 */
export async function busyIntervals(fromMs: number, toMs: number): Promise<[number, number][]> {
  const q = new URLSearchParams({
    startDateTime: new Date(fromMs).toISOString(),
    endDateTime: new Date(toMs).toISOString(),
    $select: "start,end,showAs,isCancelled",
    $top: "500",
  });
  const body = (await graph(`/me/calendarView?${q}`, {
    headers: { prefer: 'outlook.timezone="UTC"' },
  })) as { value: GraphEvent[] };
  return body.value
    .filter((e) => !e.isCancelled && e.showAs !== "free")
    .map((e) => [Date.parse(`${e.start.dateTime}Z`), Date.parse(`${e.end.dateTime}Z`)]);
}

export async function sendMail(m: { to: string; subject: string; html: string; replyTo?: { name: string; email: string } }) {
  await graph("/me/sendMail", {
    method: "POST",
    body: JSON.stringify({
      message: {
        subject: m.subject,
        body: { contentType: "HTML", content: m.html },
        toRecipients: [{ emailAddress: { address: m.to } }],
        ...(m.replyTo && { replyTo: [{ emailAddress: { address: m.replyTo.email, name: m.replyTo.name } }] }),
      },
      saveToSentItems: true,
    }),
  });
}

/** Creates the event with the guest as an attendee, which makes Outlook send them the invite. */
export async function createEvent(e: {
  subject: string;
  html: string;
  startMs: number;
  endMs: number;
  location: string;
  attendee: { name: string; email: string };
}) {
  await graph("/me/events", {
    method: "POST",
    body: JSON.stringify({
      subject: e.subject,
      body: { contentType: "HTML", content: e.html },
      start: { dateTime: new Date(e.startMs).toISOString().replace("Z", ""), timeZone: "UTC" },
      end: { dateTime: new Date(e.endMs).toISOString().replace("Z", ""), timeZone: "UTC" },
      location: { displayName: e.location },
      attendees: [{ emailAddress: { address: e.attendee.email, name: e.attendee.name }, type: "required" }],
      allowNewTimeProposals: false,
    }),
  });
}
