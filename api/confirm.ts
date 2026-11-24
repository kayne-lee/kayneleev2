/**
 * /api/confirm?id=... : the link in the requester's verification email.
 * GET shows a Turnstile check and a button; only the POST confirms.
 */
import { esc, page } from "./_lib/html.js";
import { clientIp } from "./_lib/http.js";
import { getRequest, pipelineReady, verified } from "./_lib/requests.js";
import { passedTurnstile } from "./_lib/turnstile.js";

const gone = () =>
  page("Link expired", "<p>This confirmation link has expired or was already used. You can send a new request any time.</p>", {
    status: 410,
  });

export async function GET(req: Request): Promise<Response> {
  if (!pipelineReady()) return page("Unavailable", "<p>This isn't set up yet.</p>", { status: 503 });
  const id = new URL(req.url).searchParams.get("id") ?? "";
  const r = await getRequest(id);
  if (!r || r.status !== "unverified") return gone();

  const siteKey = process.env.TURNSTILE_SITE_KEY ?? "";
  return page(
    r.kind === "meeting" ? "Confirm your call request" : "Confirm your message",
    `<p>Hi ${esc(r.name)}, press confirm to send this to Kayne.</p>
<form method="post">
  <input type="hidden" name="id" value="${esc(r.id)}">
  <div class="cf-turnstile" data-sitekey="${esc(siteKey)}"></div>
  <button class="primary" type="submit">Confirm</button>
</form>`,
    { head: '<script src="https://challenges.cloudflare.com/turnstile/v0/api.js" async defer></script>' },
  );
}

export async function POST(req: Request): Promise<Response> {
  if (!pipelineReady()) return page("Unavailable", "<p>This isn't set up yet.</p>", { status: 503 });
  const form = await req.formData();
  const r = await getRequest(String(form.get("id") ?? ""));
  if (!r || r.status !== "unverified") return gone();

  if (!(await passedTurnstile(form.get("cf-turnstile-response") as string | null, clientIp(req)))) {
    return page("Check failed", "<p>The human check didn't pass. Go back and try again.</p>", { status: 403 });
  }
  return page("Thanks", `<p>${esc(await verified(r))}</p>`);
}
