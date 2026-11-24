import { booking } from "./config.js";
import { busyIntervals } from "./graph.js";
import { localDay, zonedToUtc } from "./time.js";

const MIN = 60_000;

/** Every slot the booking rules allow over the next `days`, before checking the calendar. */
function candidateSlots(now: number, days: number): [number, number][] {
  const out: [number, number][] = [];
  const earliest = now + booking.minNoticeHours * 60 * MIN;
  for (let i = 0; i <= days; i++) {
    const { date, weekday } = localDay(now + i * 24 * 60 * MIN, booking.timeZone);
    if (!booking.weekdays.includes(weekday)) continue;
    for (const w of booking.windows) {
      const end = zonedToUtc(date, w.end, booking.timeZone);
      for (let s = zonedToUtc(date, w.start, booking.timeZone); s + booking.slotMinutes * MIN <= end; s += booking.slotMinutes * MIN) {
        if (s >= earliest) out.push([s, s + booking.slotMinutes * MIN]);
      }
    }
  }
  return out;
}

/** Open slots as [startMs, endMs], with existing events (plus a buffer) taken out. */
export async function openSlots(days = booking.daysAhead, now = Date.now()): Promise<[number, number][]> {
  const candidates = candidateSlots(now, Math.min(days, booking.daysAhead));
  if (candidates.length === 0) return [];
  const pad = booking.bufferMinutes * MIN;
  const busy = await busyIntervals(candidates[0][0] - pad, candidates.at(-1)![1] + pad);
  return candidates.filter(([s, e]) => !busy.some(([bs, be]) => s < be + pad && e > bs - pad));
}

/** Whether a slot starting at `startMs` is still bookable right now. */
export async function isOpen(startMs: number): Promise<boolean> {
  return (await openSlots()).some(([s]) => s === startMs);
}

/** Monday 00:00 to next Monday in Kayne's zone, for the weekly meeting cap. */
export function weekBounds(ms: number): [number, number] {
  const { date, weekday } = localDay(ms, booking.timeZone);
  const monday = localDay(zonedToUtc(date, "12:00", booking.timeZone) - (weekday - 1) * 24 * 60 * MIN, booking.timeZone).date;
  const start = zonedToUtc(monday, "00:00", booking.timeZone);
  const nextMonday = localDay(start + 7.5 * 24 * 60 * MIN, booking.timeZone).date;
  return [start, zonedToUtc(nextMonday, "00:00", booking.timeZone)];
}
