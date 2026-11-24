/** Escapes text for HTML. Everything a requester typed goes through this. */
export const esc = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

/** A small standalone page for the confirm and review flows. `body` must already be escaped. */
export function page(title: string, body: string, opts: { status?: number; head?: string } = {}): Response {
  const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex">
<title>${esc(title)}</title>
${opts.head ?? ""}
<style>
  :root { color-scheme: light dark; font-family: system-ui, sans-serif; }
  body { max-width: 34rem; margin: 4rem auto; padding: 0 1.25rem; line-height: 1.55; }
  h1 { font-size: 1.4rem; }
  dl { display: grid; grid-template-columns: max-content 1fr; gap: .35rem 1rem; }
  dt { opacity: .65; }
  dd { margin: 0; white-space: pre-wrap; overflow-wrap: anywhere; }
  form { display: flex; gap: .6rem; flex-wrap: wrap; margin-top: 1.5rem; align-items: center; }
  button { font: inherit; padding: .55rem 1.1rem; border-radius: .5rem; border: 1px solid currentColor; background: none; cursor: pointer; }
  button.primary { background: #2563eb; border-color: #2563eb; color: white; }
</style>
</head>
<body>
<h1>${esc(title)}</h1>
${body}
</body>
</html>`;
  return new Response(html, {
    status: opts.status ?? 200,
    headers: {
      "content-type": "text/html; charset=utf-8",
      "cache-control": "no-store",
      "x-frame-options": "DENY",
      "referrer-policy": "no-referrer",
    },
  });
}

/** Simple email body: a paragraph per string, plus an optional button link. Pass escaped text. */
export function emailHtml(paragraphs: string[], button?: { href: string; text: string }): string {
  const ps = paragraphs.map((p) => `<p style="margin:0 0 14px">${p}</p>`).join("");
  const btn = button
    ? `<p><a href="${esc(button.href)}" style="display:inline-block;padding:10px 18px;background:#2563eb;color:#fff;border-radius:6px;text-decoration:none">${esc(button.text)}</a></p>`
    : "";
  return `<div style="font-family:system-ui,sans-serif;font-size:15px;line-height:1.5;max-width:520px">${ps}${btn}</div>`;
}
