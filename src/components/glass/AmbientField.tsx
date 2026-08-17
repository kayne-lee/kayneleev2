/**
 * The substrate the glass refracts.
 *
 * Two glossy orbs floating on the pastel mesh painted on <html>. They sit
 * behind every pane but extend past the frame's edges, so each one is part
 * crisp against open background and part bent through frosted glass — which
 * is the only way translucency reads as a material rather than as opacity.
 *
 * Purely decorative: aria-hidden, pointer-events none, and it holds still
 * for anyone who asked for reduced motion.
 */
export const AmbientField = () => (
  <div className="ambient-field pointer-events-none fixed inset-0 -z-10 overflow-hidden" aria-hidden>
    {/* Cobalt swoosh, upper right — clipped by the viewport edge. */}
    <div className="orb orb-blue" />

    {/* Magenta sphere, lower left — the heaviest object on the page. */}
    <div className="orb orb-pink" />

    {/* Soft mint bloom that keeps the lower right from going flat. */}
    <div className="orb orb-mint" />
  </div>
);
