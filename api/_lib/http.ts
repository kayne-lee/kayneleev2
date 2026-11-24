/** The caller's IP as Vercel reports it. Falls back to a shared bucket locally. */
export function clientIp(req: Request | undefined): string {
  const forwarded = req?.headers.get("x-forwarded-for");
  return forwarded?.split(",")[0].trim() || req?.headers.get("x-real-ip") || "unknown";
}

/** A tool result carrying JSON for the model to read. */
export function json(data: unknown) {
  return { content: [{ type: "text" as const, text: JSON.stringify(data, null, 2) }] };
}

/** A tool result for something the caller did wrong or that isn't available. */
export function toolError(message: string) {
  return { content: [{ type: "text" as const, text: message }], isError: true };
}
