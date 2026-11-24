/**
 * Just enough time zone math to lay out slots in Kayne's zone without a date
 * library: turn a local wall-clock time into a UTC instant, and back.
 */

/** Offset of `zone` from UTC at instant `ms`, in milliseconds (e.g. -5h for EST). */
function offsetMs(ms: number, zone: string): number {
  const name = new Intl.DateTimeFormat("en-US", { timeZone: zone, timeZoneName: "longOffset" })
    .formatToParts(ms)
    .find((p) => p.type === "timeZoneName")!.value; // "GMT-05:00", or "GMT" at zero
  const m = name.match(/GMT([+-])(\d{2}):(\d{2})/);
  if (!m) return 0;
  const sign = m[1] === "-" ? -1 : 1;
  return sign * (Number(m[2]) * 60 + Number(m[3])) * 60_000;
}

/** The UTC instant for local `date` ("YYYY-MM-DD") at `time` ("HH:MM") in `zone`. */
export function zonedToUtc(date: string, time: string, zone: string): number {
  const [y, mo, d] = date.split("-").map(Number);
  const [h, mi] = time.split(":").map(Number);
  const asIfUtc = Date.UTC(y, mo - 1, d, h, mi);
  // Apply the offset, then check it again at the result in case a DST change sits in between.
  const first = asIfUtc - offsetMs(asIfUtc, zone);
  return asIfUtc - offsetMs(first, zone);
}

/** Local calendar date ("YYYY-MM-DD") and ISO weekday (1 = Monday) of `ms` in `zone`. */
export function localDay(ms: number, zone: string): { date: string; weekday: number } {
  const date = new Intl.DateTimeFormat("en-CA", { timeZone: zone }).format(ms);
  const wd = new Intl.DateTimeFormat("en-US", { timeZone: zone, weekday: "short" }).format(ms);
  return { date, weekday: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].indexOf(wd) + 1 };
}

/** "Wed, Nov 25, 10:00 AM EST" */
export function label(ms: number, zone: string): string {
  return new Intl.DateTimeFormat("en-US", {
    timeZone: zone,
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    timeZoneName: "short",
  }).format(ms);
}
