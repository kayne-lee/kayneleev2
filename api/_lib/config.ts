/**
 * Booking rules and abuse limits. Edit these to change when people can book
 * you and how much traffic the contact tools will accept.
 */
export const booking = {
  /** Slots are laid out in this zone. Callers see UTC plus a label in it. */
  timeZone: "America/Toronto",
  /** ISO weekdays you take calls on: 1 = Monday ... 7 = Sunday. */
  weekdays: [1, 2, 3, 4, 5],
  /** Local time windows on those days, 24h "HH:MM". */
  windows: [
    { start: "10:00", end: "12:00" },
    { start: "14:00", end: "17:00" },
  ],
  slotMinutes: 20,
  /** Free time kept on each side of an existing event. */
  bufferMinutes: 10,
  /** No booking sooner than this from now. */
  minNoticeHours: 24,
  daysAhead: 14,
  /** Hard ceiling on meetings booked per week (Mon to Sun, in timeZone). */
  maxMeetingsPerWeek: 4,
};

export const limits = {
  /** Verified requests waiting on your yes. New ones are refused past this. */
  maxPending: 10,
  /** Requests one IP or one email address can start per day. */
  perIpPerDay: 3,
  perEmailPerDay: 3,
  /** Verification emails sent per day across everyone. */
  verificationEmailsPerDay: 30,
  /** How long someone has to click their verification link. */
  verifyWindowMinutes: 30,
  /** How long a verified request waits for your review before it lapses. */
  reviewWindowDays: 7,
};

/** Where review emails go and where links point. */
export const ownerEmail = process.env.OWNER_EMAIL ?? "";
export const siteUrl = (process.env.SITE_URL ?? "https://kayneleev2.vercel.app").replace(/\/$/, "");
export const meetingUrl = process.env.MEETING_URL ?? "";
