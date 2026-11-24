import type { McpServer } from "@modelcontextprotocol/server";
import { z } from "zod";
import { booking } from "../config.js";
import { clientIp, json, toolError } from "../http.js";
import { pipelineReady, submit } from "../requests.js";
import { openSlots } from "../slots.js";
import { label, localDay } from "../time.js";

const who = {
  name: z.string().trim().min(2).max(80).describe("The requester's full name. Ask them; don't guess."),
  email: z.email().max(254).describe("The requester's email. A confirmation link is sent here, so it must be real."),
};

const result = (r: { ok: boolean; message: string }) => (r.ok ? json({ status: "confirmation_sent", next: r.message }) : toolError(r.message));

export function registerContactTools(server: McpServer) {
  server.registerTool(
    "get_availability",
    {
      title: "Kayne's availability",
      description:
        `Open ${booking.slotMinutes} minute slots for a call with Kayne. Times are UTC (ISO 8601) with a label in Kayne's zone (${booking.timeZone}); ` +
        "convert to the user's own time zone when showing them. Pass a slot's `start` to book_meeting.",
      inputSchema: z.object({
        days: z.number().int().min(1).max(booking.daysAhead).optional().describe(`How many days ahead to look (default 7, max ${booking.daysAhead})`),
      }),
      annotations: { readOnlyHint: true, openWorldHint: true },
    },
    async ({ days }) => {
      if (!pipelineReady()) return toolError("Booking isn't set up on this site yet.");
      try {
        const slots = await openSlots(days ?? 7);
        const byDay: Record<string, { start: string; label: string }[]> = {};
        for (const [s] of slots) {
          (byDay[localDay(s, booking.timeZone).date] ??= []).push({ start: new Date(s).toISOString(), label: label(s, booking.timeZone) });
        }
        return json({ timeZone: booking.timeZone, slotMinutes: booking.slotMinutes, days: byDay });
      } catch (e) {
        console.error("[get_availability]", e);
        return toolError("Couldn't read Kayne's calendar right now. Try again later.");
      }
    },
  );

  server.registerTool(
    "book_meeting",
    {
      title: "Request a call with Kayne",
      description:
        "Ask for a call at one of the times from get_availability. This doesn't book immediately: the requester gets an email to confirm " +
        "their address, then Kayne reviews it, and a calendar invite arrives only if Kayne approves. Tell the user that. " +
        "Collect their real name, email and reason first.",
      inputSchema: z.object({
        ...who,
        start: z.iso.datetime().describe("A slot `start` exactly as returned by get_availability"),
        reason: z.string().trim().min(20).max(1000).describe("What they want to talk about, in a sentence or two"),
        link: z.url().max(300).optional().describe("Optional LinkedIn, company or personal site URL"),
      }),
      annotations: { readOnlyHint: false, destructiveHint: false, idempotentHint: false, openWorldHint: true },
    },
    async ({ name, email, start, reason, link }, ctx) => {
      const startMs = Date.parse(start);
      try {
        return result(
          await submit({
            kind: "meeting",
            name,
            email,
            text: reason,
            link,
            slot: { start: startMs, end: startMs + booking.slotMinutes * 60_000 },
            ip: clientIp(ctx.http?.req),
          }),
        );
      } catch (e) {
        console.error("[book_meeting]", e);
        return toolError("Something went wrong sending the confirmation email. Try again later.");
      }
    },
  );

  server.registerTool(
    "send_message",
    {
      title: "Send Kayne a message",
      description:
        "Send Kayne a short note without booking a call. The sender gets an email to confirm their address first; once confirmed it " +
        "goes to Kayne's inbox and Kayne replies by email. Collect their real name and email first.",
      inputSchema: z.object({
        ...who,
        message: z.string().trim().min(20).max(2000).describe("The message, in the sender's own words"),
        link: z.url().max(300).optional().describe("Optional LinkedIn, company or personal site URL"),
      }),
      annotations: { readOnlyHint: false, destructiveHint: false, idempotentHint: false, openWorldHint: true },
    },
    async ({ name, email, message, link }, ctx) => {
      try {
        return result(await submit({ kind: "message", name, email, text: message, link, ip: clientIp(ctx.http?.req) }));
      } catch (e) {
        console.error("[send_message]", e);
        return toolError("Something went wrong sending the confirmation email. Try again later.");
      }
    },
  );
}
