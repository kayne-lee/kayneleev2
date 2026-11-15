import type { CSSProperties } from "react";
import { useLocation } from "react-router-dom";
import { VIEWS, viewIndex } from "./sections";

const ramp = (value: number, from: number, to: number) => Math.min(1, Math.max(0, (value - from) / (to - from)));

/**
 * The gradient field behind the whole site.
 *
 * Dawn is four drifting discs; noon and dusk are static washes stacked on top.
 * Which page you are on sets how much of each shows, so the field runs from
 * warm at the hero, through rose, to deep at contact, and eases between them
 * as you move from page to page. Grain sits over all of it. Only `opacity`
 * and `transform` ever change, so nothing here repaints.
 *
 * Purely decorative: aria-hidden and pointer-events none.
 */
export const GrainField = () => {
  const { pathname } = useLocation();
  const index = viewIndex(pathname);
  // Unknown paths (the 404) get the first page's colours.
  const progress = index < 0 ? 0 : index / (VIEWS.length - 1);

  return (
    <div
      className="field"
      style={{ "--noon": ramp(progress, 0, 0.5), "--dusk": ramp(progress, 0.5, 1) } as CSSProperties}
      aria-hidden
    >
      <div className="field-dawn">
        <div className="blob blob-glow" />
        <div className="blob blob-sky" />
        <div className="blob blob-orchid" />
        <div className="blob blob-iris" />
      </div>
      <div className="field-noon" />
      <div className="field-dusk" />
      <div className="field-grain" />
    </div>
  );
};
