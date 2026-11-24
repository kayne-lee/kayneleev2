/**
 * /api/review?id=...&key=... : the link in Kayne's review email. The key is
 * an HMAC of the id, so only that email can open it. GET shows the request;
 * only the POST from one of its buttons acts.
 */
import { booking } from "./_lib/config.js";
import { esc, page } from "./_lib/html.js";
import { getRequest, pipelineReady, review, validReviewKey } from "./_lib/requests.js";
import { label } from "./_lib/time.js";

async function load(id: string, key: string) {
  if (!pipelineReady()) return { error: page("Unavailable", "<p>This isn't set up yet.</p>", { status: 503 }) };
  if (!validReviewKey(id, key)) return { error: page("Not found", "<p>Nothing here.</p>", { status: 404 }) };
  const r = await getRequest(id);
  if (!r) return { error: page("Expired", "<p>This request has expired.</p>", { status: 410 }) };
  return { r };
}

export async function GET(req: Request): Promise<Response> {
  const q = new URL(req.url).searchParams;
  const { r, error } = await load(q.get("id") ?? "", q.get("key") ?? "");
  if (error) return error;

  const rows = [
    ["From", `${r.name} <${r.email}>`],
    ...(r.link ? [["Link", r.link]] : []),
    ...(r.slot ? [["When", label(r.slot.start, booking.timeZone)]] : []),
    [r.kind === "meeting" ? "Reason" : "Message", r.text],
    ["Status", r.status],
  ];
  const actions =
    r.kind === "meeting" && r.status === "pending"
      ? `<button class="primary" name="action" value="approve">Approve and send invite</button>
         <button name="action" value="decline">Decline</button>
         <button name="action" value="block">Block sender</button>`
      : `<button name="action" value="block">Block sender</button>`;

  return page(
    r.kind === "meeting" ? "Call request" : "Message",
    `<dl>${rows.map(([k, v]) => `<dt>${esc(k)}</dt><dd>${esc(v)}</dd>`).join("")}</dl>
<form method="post">
  <input type="hidden" name="id" value="${esc(r.id)}">
  <input type="hidden" name="key" value="${esc(q.get("key")!)}">
  ${actions}
</form>`,
  );
}

export async function POST(req: Request): Promise<Response> {
  const form = await req.formData();
  const { r, error } = await load(String(form.get("id") ?? ""), String(form.get("key") ?? ""));
  if (error) return error;

  const action = String(form.get("action"));
  if (action !== "approve" && action !== "decline" && action !== "block") {
    return page("Unknown action", "<p>Go back and pick one of the buttons.</p>", { status: 400 });
  }
  return page("Done", `<p>${esc(await review(r, action))}</p>`);
}
