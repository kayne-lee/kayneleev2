import { useCallback, useEffect, useLayoutEffect, useRef, useState, type ReactNode } from "react";
import { Briefcase, Calendar, Code, GraduationCap, Heart, Users, Wrench, X } from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { DashboardHeader } from "@/components/DashboardHeader";
import { SectionCard } from "@/components/SectionCard";
import { GlassPane } from "@/components/glass/GlassPane";
import TechStack from "@/components/TechStack";

import { EducationSection } from "@/components/sections/EducationSection";
import { ExperienceSection } from "@/components/sections/ExperienceSection";
import { ExtracurricularsSection } from "@/components/sections/ExtracurricularsSection";
import { HobbiesSection } from "@/components/sections/HobbiesSection";
import { NowSection } from "@/components/sections/NowSection";
import { ProjectsSection } from "@/components/sections/ProjectsSection";
import {
  EducationPreview,
  ExperiencePreview,
  ExtracurricularsPreview,
  HobbiesPreview,
  NowPreview,
  ProjectsPreview,
  TechStackPreview,
} from "@/components/tiles/TilePreviews";

import { experience, extracurriculars, hobbies, projects } from "@/data/portfolio";

type SectionId =
  | "experience"
  | "education"
  | "projects"
  | "techstack"
  | "hobbies"
  | "current"
  | "extracurriculars";

type SectionDefinition = {
  id: SectionId;
  /** Mono label on the tile. Carries the count, so it does real work. */
  eyebrow: string;
  title: string;
  icon: LucideIcon;
  /** Grid placement. 4x3 at lg, 3x4 at md, 2-col at sm, stacked below. */
  area: string;
  /** Reading measure for the opened panel — prose narrows, grids spread. */
  measure: string;
  preview: ReactNode;
  body: ReactNode;
};

const CONTAINER_RADIUS = 26;

/* Choreography. The old version waited for the morph to finish before even
   starting the content fade, so a section took ~800ms to become readable and
   the two halves felt like separate events. Now they overlap: content begins
   arriving while the pane is still growing, and on close it leaves while the
   pane is still shrinking. */
const OPEN_MS = 460; // pane grows
const CONTENT_IN_AT = 60; // content starts arriving, almost immediately
const CLOSE_MS = 400; // pane shrinks
/* Closing mirrors opening rather than reversing the old two-step. The content
   holds still and full-strength while the shrinking pane clips it away from
   the edges in; it only fades over the last stretch, once there is little
   left to see. Fading it up front is what made the close read as an empty
   white box collapsing. */
const CONTENT_OUT_MS = 280;
const CONTENT_OUT_DELAY = 120; // 120 + 280 == CLOSE_MS, so both land together

const pad = (n: number) => String(n).padStart(2, "0");

const SECTIONS: SectionDefinition[] = [
  {
    id: "experience",
    eyebrow: `${pad(experience.length)} — Positions`,
    title: "Experience",
    icon: Briefcase,
    area: "sm:col-span-2 lg:col-span-2 lg:row-span-2",
    measure: "max-w-4xl",
    preview: <ExperiencePreview />,
    body: <ExperienceSection />,
  },
  {
    id: "education",
    eyebrow: "In progress",
    title: "Education",
    icon: GraduationCap,
    area: "lg:col-start-3 lg:row-start-1",
    measure: "max-w-4xl",
    preview: <EducationPreview />,
    body: <EducationSection />,
  },
  {
    id: "techstack",
    eyebrow: "Toolkit",
    title: "Tech stack",
    icon: Wrench,
    area: "lg:col-start-4 lg:row-start-1 lg:row-span-2",
    measure: "max-w-6xl",
    preview: <TechStackPreview />,
    body: <TechStack />,
  },
  {
    id: "projects",
    eyebrow: `${pad(projects.length)} — Shipped`,
    title: "Projects",
    icon: Code,
    area: "lg:col-start-3 lg:row-start-2",
    measure: "max-w-4xl",
    preview: <ProjectsPreview />,
    body: <ProjectsSection />,
  },
  {
    id: "current",
    eyebrow: "Right now",
    title: "Current focus",
    icon: Calendar,
    area: "lg:col-start-1 lg:row-start-3",
    measure: "max-w-6xl",
    preview: <NowPreview />,
    body: <NowSection />,
  },
  {
    id: "extracurriculars",
    eyebrow: `${pad(extracurriculars.length)} — Activities`,
    title: "Extracurriculars",
    icon: Users,
    area: "lg:col-start-2 lg:row-start-3",
    measure: "max-w-4xl",
    preview: <ExtracurricularsPreview />,
    body: <ExtracurricularsSection />,
  },
  {
    id: "hobbies",
    eyebrow: `${pad(hobbies.length)} — Off the clock`,
    title: "Hobbies",
    icon: Heart,
    area: "sm:col-span-2 lg:col-span-2 lg:col-start-3 lg:row-start-3",
    measure: "max-w-6xl",
    preview: <HobbiesPreview />,
    body: <HobbiesSection />,
  },
];

/* The panel is CSS-positioned `inset: 0` — it always exactly covers the
   frame, at any zoom or window size. The morph is a clip-path wipe from the
   tile's rect out to the full frame, which means:
     - no absolute pixel geometry is ever stored, so nothing can go stale when
       the layout changes underneath it (browser zoom was leaving the panel
       stranded at coordinates captured before the zoom);
     - the content is laid out at full size from the first frame and never
       reflows, so the glass reveals it rather than popping it in;
     - closing re-measures the tile, so it always lands exactly where the tile
       actually is now, not where it was when the panel opened. */
const FULL_CLIP = `inset(0px round ${CONTAINER_RADIUS}px)`;

/**
 * A clip-path covering just this tile's rect within the frame.
 *
 * Deliberately uses layout offsets, not getBoundingClientRect. While a
 * section is open the grid carries `scale(0.98)`, and getBoundingClientRect
 * reports the *visually transformed* box — measured 14px left, 5px top and
 * 14px narrow. Closing therefore animated to the wrong rect and the tile
 * snapped into place when the grid un-scaled, which is the jump at the end of
 * the close. offset* are layout values, so the transform cannot touch them.
 */
const insetForCard = (frame: HTMLElement | null, card: HTMLElement | null) => {
  if (!frame || !card) return null;

  // Accumulate up the offsetParent chain in case anything between the tile
  // and the frame ever becomes positioned.
  let top = 0;
  let left = 0;
  let node: HTMLElement | null = card;
  while (node && node !== frame) {
    top += node.offsetTop;
    left += node.offsetLeft;
    node = node.offsetParent as HTMLElement | null;
  }

  // `inset: 0` resolves against the padding box, which is what client* report.
  const right = Math.max(0, frame.clientWidth - left - card.offsetWidth);
  const bottom = Math.max(0, frame.clientHeight - top - card.offsetHeight);
  const radius = parseFloat(window.getComputedStyle(card).borderRadius) || CONTAINER_RADIUS;
  return `inset(${top}px ${right}px ${bottom}px ${left}px round ${radius}px)`;
};

const Index = () => {
  const gridRef = useRef<HTMLDivElement>(null);
  const closeTimeoutRef = useRef<number>();
  const contentTimeoutRef = useRef<number>();
  const cardRefs = useRef<Partial<Record<SectionId, HTMLDivElement | null>>>({});

  const [visibleSection, setVisibleSection] = useState<SectionId | null>(null);
  const [isClosing, setIsClosing] = useState(false);
  const [showContent, setShowContent] = useState(false);

  const panelRef = useRef<HTMLDivElement>(null);
  /* Clip is driven straight on the node rather than through state. Going
     through React meant the start value and the end value could land in the
     same frame — the browser never painted the start, so no transition fired
     and the panel just sat there collapsed over its own hidden tile, which is
     the blank box. Forcing a reflow between the two writes makes the browser
     commit the start value first, every time. */
  const pendingOpenRef = useRef<string | null>(null);

  const applyClip = useCallback((value: string, durationMs: number | null) => {
    const node = panelRef.current;
    if (!node) return;
    if (durationMs === null) {
      node.style.transition = "none";
      node.style.clipPath = value;
      void node.offsetWidth; // flush, so the next write has something to animate from
    } else {
      node.style.transition = `clip-path ${durationMs}ms var(--ease-glass)`;
      node.style.clipPath = value;
    }
  }, []);

  // Runs after the panel is in the DOM but before paint.
  useLayoutEffect(() => {
    if (!visibleSection) return;
    const start = pendingOpenRef.current;
    if (!start) return;
    pendingOpenRef.current = null;
    applyClip(start, null);
    applyClip(FULL_CLIP, OPEN_MS);
  }, [applyClip, visibleSection]);

  const currentSection = SECTIONS.find((section) => section.id === visibleSection) ?? null;
  const SectionIcon = currentSection?.icon;

  useEffect(
    () => () => {
      if (closeTimeoutRef.current) window.clearTimeout(closeTimeoutRef.current);
      if (contentTimeoutRef.current) window.clearTimeout(contentTimeoutRef.current);
    },
    [],
  );

  const openSection = useCallback((section: SectionId) => {
    // Measured before the tile is hidden, so this is its live position.
    pendingOpenRef.current = insetForCard(gridRef.current, cardRefs.current[section] ?? null) ?? FULL_CLIP;

    setIsClosing(false);
    setShowContent(false);
    setVisibleSection(section);

    if (contentTimeoutRef.current) window.clearTimeout(contentTimeoutRef.current);
    contentTimeoutRef.current = window.setTimeout(() => setShowContent(true), CONTENT_IN_AT);
  }, []);

  const closeSection = useCallback(
    (section: SectionId, onClosed?: () => void) => {
      setShowContent(false);
      setIsClosing(true);

      const node = panelRef.current;
      // Re-measured now rather than reused from open, so the pane lands on the
      // tile wherever it currently sits — even if the window or zoom changed.
      const target = insetForCard(gridRef.current, cardRefs.current[section] ?? null) ?? FULL_CLIP;

      const finish = () => {
        if (closeTimeoutRef.current) window.clearTimeout(closeTimeoutRef.current);
        closeTimeoutRef.current = undefined;
        node?.removeEventListener("transitionend", handleEnd);
        setVisibleSection(null);
        setIsClosing(false);
        setShowContent(false);
        onClosed?.();
      };

      // Hand the tile back the frame the pane lands, not a timer's guess at it.
      // A stale timer is what left an empty glass rectangle sitting on a
      // still-hidden tile for the last stretch of the close.
      function handleEnd(event: TransitionEvent) {
        if (event.target === node && event.propertyName === "clip-path") finish();
      }

      node?.addEventListener("transitionend", handleEnd);
      applyClip(target, CLOSE_MS);

      // Fallback: transitionend never fires under reduced motion or in a
      // backgrounded tab.
      if (closeTimeoutRef.current) window.clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = window.setTimeout(finish, CLOSE_MS + 120);
    },
    [applyClip],
  );

  const handleCardClick = (section: SectionId) => {
    if (isClosing) return;
    if (visibleSection === section) return closeSection(section);
    if (visibleSection) return closeSection(visibleSection, () => openSection(section));
    openSection(section);
  };

  const handleClose = useCallback(() => {
    if (!visibleSection || isClosing) return;
    closeSection(visibleSection);
  }, [closeSection, isClosing, visibleSection]);

  useEffect(() => {
    if (!visibleSection) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") handleClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [handleClose, visibleSection]);

  const isOpen = Boolean(visibleSection) && !isClosing;

  return (
    <div className="flex min-h-dvh flex-col gap-3 p-4 sm:gap-4 sm:p-6 lg:h-dvh lg:overflow-hidden lg:gap-5 lg:p-9">
      <DashboardHeader />

      <main className="flex min-h-0 flex-1 flex-col">
        <GlassPane
          ref={gridRef}
          depth={1}
          frost
          settleIndex={1}
          className="relative flex min-h-0 flex-1 flex-col overflow-hidden p-3 sm:p-4 lg:p-5"
        >
          {/* The tile grid. Blurs and recedes behind the opening pane —
              which is the one moment backdrop-filter has real content to bend. */}
          <div
            className={`grid min-h-0 flex-1 gap-3 transition-all [transition-timing-function:var(--ease-glass)] sm:grid-cols-2 lg:h-full lg:auto-rows-fr lg:grid-cols-4 lg:grid-rows-3 ${
              isOpen
                ? /* Blurred, not just faded. Faded-but-sharp text stays
                     readable through the panel and reads as a double
                     exposure. Blurring turns the grid into soft colour, which
                     is what keeps the open panel from looking like a plain
                     white sheet. */
                  "pointer-events-none scale-[0.98] opacity-40 blur-[12px]"
                : "pointer-events-auto scale-100 opacity-100 blur-0"
            }`}
            style={{
              transitionDuration: `${isClosing ? CLOSE_MS : OPEN_MS}ms`,
            }}
          >
            {SECTIONS.map((section, index) => (
              <SectionCard
                key={section.id}
                ref={(node) => {
                  cardRefs.current[section.id] = node;
                }}
                eyebrow={section.eyebrow}
                title={section.title}
                settleIndex={index + 2}
                className={`min-h-[11.5rem] lg:min-h-0 ${section.area}`}
                onClick={() => handleCardClick(section.id)}
                /* Hidden while its own pane is lifted off — the overlay is
                   standing in for it, so two copies must never show at once. */
                style={{ visibility: visibleSection === section.id ? "hidden" : "visible" }}
              >
                {section.preview}
              </SectionCard>
            ))}
          </div>

          {visibleSection && (
            <div
              role="dialog"
              aria-modal="true"
              aria-label={currentSection?.title}
              ref={panelRef}
              className={`glass glass-panel absolute inset-0 z-20 flex flex-col overflow-hidden ${
                isClosing ? "pointer-events-none" : "pointer-events-auto"
              }`}
              style={{
                clipPath: FULL_CLIP,
                padding: "clamp(1rem, 2vw, 1.75rem)",
                willChange: "clip-path",
              }}
            >
              <div
                className="flex min-h-0 flex-1 flex-col"
                style={{
                  opacity: showContent ? 1 : 0,
                  transition: showContent
                    ? "opacity 300ms var(--ease-glass)"
                    : `opacity ${CONTENT_OUT_MS}ms ease-in ${CONTENT_OUT_DELAY}ms`,
                }}
                aria-hidden={!showContent}
              >
                {/* Header shares the content's measure so the title, the
                    close button, and every card below sit on one column. */}
                <div
                  className={`mx-auto mb-5 flex w-full items-start justify-between gap-4 ${
                    currentSection?.measure ?? "max-w-4xl"
                  }`}
                >
                  <div className="flex min-w-0 items-start gap-3.5">
                    {SectionIcon && (
                      <span className="glass-well flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl">
                        <SectionIcon className="h-5 w-5 text-ink-2" aria-hidden />
                      </span>
                    )}
                    <div className="min-w-0">
                      <p className="eyebrow">{currentSection?.eyebrow}</p>
                      <h2 className="mt-0.5 font-display text-2xl font-bold tracking-[-0.03em] text-ink sm:text-3xl">
                        {currentSection?.title}
                      </h2>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleClose}
                    className="glass-chip shrink-0 p-2.5 hover:text-ink"
                    aria-label="Close section"
                  >
                    <X className="h-4 w-4" aria-hidden />
                  </button>
                </div>

                <div className="-mr-1 min-h-0 flex-1 overflow-y-auto pr-1 sm:-mr-2 sm:pr-2">
                  <div className={`mx-auto w-full ${currentSection?.measure ?? "max-w-4xl"}`}>
                    {currentSection?.body}
                  </div>
                </div>
              </div>
            </div>
          )}
        </GlassPane>
      </main>
    </div>
  );
};

export default Index;
