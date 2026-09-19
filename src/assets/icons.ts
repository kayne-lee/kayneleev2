/**
 * Tech logos, served from our own origin.
 *
 * These used to be built into `https://api.iconify.design/<slug>.svg` URLs and
 * dropped straight into `<img src>`, which meant one cross-origin request per
 * icon at render time — 9 of them on first paint, each paying DNS + TLS to a
 * third party on the critical path, with no preconnect.
 *
 * The SVGs are now vendored in ./icons and resolved at build time. Vite inlines
 * the small ones as data URIs and content-hashes the rest, so first paint costs
 * no extra network requests and nothing depends on a third party staying up.
 *
 * To add an icon: download it from Iconify into ./icons using the slug's name
 * (`logos:foo-icon` -> `foo-icon.svg`); this picks it up automatically.
 */
const files = import.meta.glob<string>("./icons/*.svg", {
  eager: true,
  query: "?url",
  import: "default",
});

/** `logos:react` -> the bundled URL for ./icons/react.svg */
export function iconUrl(slug: string): string | undefined {
  const name = slug.replace(/^logos:/, "");
  const url = files[`./icons/${name}.svg`];
  if (!url && import.meta.env.DEV) {
    console.warn(`[icons] no vendored SVG for "${slug}" — expected src/assets/icons/${name}.svg`);
  }
  return url;
}
