/**
 * Shown while a lazily-loaded section body arrives. Sections are prefetched
 * when the browser goes idle, so in practice this is rarely seen — it exists so
 * a cold or slow connection gets a calm placeholder instead of a collapsed
 * panel that snaps to full height when the chunk lands.
 */
export const SectionFallback = () => (
  <div className="space-y-3 py-2" aria-hidden>
    {[0, 1, 2].map((i) => (
      <div
        key={i}
        className="glass-well h-16 w-full rounded-2xl opacity-40"
        style={{ animation: `breathe 2.4s var(--ease-glass) ${i * 0.12}s infinite` }}
      />
    ))}
    <span className="sr-only">Loading section</span>
  </div>
);
