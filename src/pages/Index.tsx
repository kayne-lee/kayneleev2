import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Contact } from "@/components/site/Contact";
import { Hero } from "@/components/site/Hero";
import { Sheet } from "@/components/site/Sheet";
import { SiteHeader } from "@/components/site/SiteHeader";
import { VIEWS, viewIndex, type SectionId } from "@/components/site/sections";
import { cn } from "@/lib/utils";
import TechStack from "@/components/TechStack";
import { EducationSection } from "@/components/sections/EducationSection";
import { ExperienceSection } from "@/components/sections/ExperienceSection";
import { ExtracurricularsSection } from "@/components/sections/ExtracurricularsSection";
import { HobbiesSection } from "@/components/sections/HobbiesSection";
import { NowSection } from "@/components/sections/NowSection";
import { ProjectsSection } from "@/components/sections/ProjectsSection";

const BODIES: Record<SectionId, ReactNode> = {
  experience: <ExperienceSection />,
  education: <EducationSection />,
  projects: <ProjectsSection />,
  stack: <TechStack />,
  now: <NowSection />,
  extracurriculars: <ExtracurricularsSection />,
  hobbies: <HobbiesSection />,
};

const renderView = (index: number, paged: boolean) => {
  const view = VIEWS[index];
  if (view.id === "home") return <Hero />;
  if (view.id === "contact") return <Contact paged={paged} />;
  return (
    <Sheet id={view.id} paged={paged}>
      {BODIES[view.id]}
    </Sheet>
  );
};

/**
 * The site has two layouts over the same pages and the same URLs:
 *
 *  - Paged (desktop): one page on screen at a time, changed with the header,
 *    the pager or the arrow keys, sliding sideways in nav order.
 *  - Scrolling (phones, tablets, short windows): every page stacked into one
 *    ordinary scrolling page, which is what a thumb expects. The header links
 *    jump to a section, and the URL follows whichever section is in view.
 *
 * Either way `/experience` shows Experience, and the gradient field (mounted
 * in App) takes its colour from the current path.
 */
const PAGED_QUERY = "(min-width: 1024px) and (min-height: 680px)";

const usePaged = () => {
  const [paged, setPaged] = useState(() => window.matchMedia(PAGED_QUERY).matches);
  useEffect(() => {
    const query = window.matchMedia(PAGED_QUERY);
    const onChange = () => setPaged(query.matches);
    query.addEventListener("change", onChange);
    return () => query.removeEventListener("change", onChange);
  }, []);
  return paged;
};

/** Padding around a page, shared by the live layer and the one sliding away. */
const LAYER = "flex min-h-0 flex-1 flex-col pb-5 pt-4 lg:pb-6";

/* ---- Paged: one screen at a time, sliding between them ------------------- */
const PagedSite = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const index = Math.max(0, viewIndex(pathname));

  /* The page currently on screen, and — while a slide is running — the page
     being left and which way we are travelling. Derived during render (not in
     an effect) so the first frame of the new page already has its slide class
     and never flashes in place. */
  const [shown, setShown] = useState(index);
  const [slide, setSlide] = useState<{ from: number; dir: 1 | -1 } | null>(null);
  // True once the visitor has changed page at least once. From then on pages
  // enter by sliding, so their own load-in animation stays off for good.
  const [navigated, setNavigated] = useState(false);
  if (index !== shown) {
    setSlide({ from: shown, dir: index > shown ? 1 : -1 });
    setShown(index);
    setNavigated(true);
  }

  // Left / right arrows step through the pages.
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;
      const target = VIEWS[index + (event.key === "ArrowRight" ? 1 : event.key === "ArrowLeft" ? -1 : 0)];
      if (target && target !== VIEWS[index]) navigate(target.path);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [index, navigate]);

  const dirStyle = slide ? ({ "--dir": slide.dir } as CSSProperties) : undefined;

  return (
    <div className="mx-auto flex h-dvh max-w-[92rem] flex-col px-8">
      <SiteHeader />

      <main className="relative flex min-h-0 flex-1 flex-col">
        {slide && (
          // The page being left. Out of flow; removed when its slide finishes.
          <div
            key={`out-${slide.from}`}
            className={cn(LAYER, "slide-out pointer-events-none absolute inset-0 overflow-hidden")}
            style={dirStyle}
            aria-hidden
          >
            {renderView(slide.from, true)}
          </div>
        )}

        {/* Keyed so each page mounts fresh: a section's right column starts
            scrolled to the top. */}
        <div
          key={index}
          className={cn(LAYER, slide && "slide-in", navigated && "no-rise")}
          style={dirStyle}
          onAnimationEnd={(event) => {
            if (event.target === event.currentTarget) setSlide(null);
          }}
        >
          {renderView(index, true)}
        </div>
      </main>
    </div>
  );
};

/* ---- Scrolling: everything on one page ----------------------------------- */
const ScrollingSite = () => {
  const location = useLocation();
  const navigate = useNavigate();
  /* Set just before the scroll-spy rewrites the URL, so the effect below can
     tell "the visitor scrolled here" (leave the scroll alone) from "the
     visitor tapped a link" (go there). */
  const fromSpy = useRef(false);
  const first = useRef(true);

  // A link was tapped, or the page was opened at a section's URL: go to it.
  // Keyed on location.key so tapping the link for the current section still
  // scrolls back to its top.
  useEffect(() => {
    if (fromSpy.current) {
      fromSpy.current = false;
      return;
    }
    const view = VIEWS[Math.max(0, viewIndex(location.pathname))];
    const instant = first.current || window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    first.current = false;
    if (view.id === "home") window.scrollTo({ top: 0, behavior: instant ? "auto" : "smooth" });
    else document.getElementById(view.id)?.scrollIntoView({ behavior: instant ? "auto" : "smooth", block: "start" });
    // eslint-disable-next-line react-hooks/exhaustive-deps -- location.key covers pathname
  }, [location.key]);

  // Scroll-spy: the URL (and with it the highlighted nav link and the field's
  // colour) follows whichever page is crossing the middle of the screen.
  const pathRef = useRef(location.pathname);
  pathRef.current = location.pathname;
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const view = VIEWS.find((candidate) => candidate.id === entry.target.id);
          if (!view || viewIndex(pathRef.current) === VIEWS.indexOf(view)) continue;
          fromSpy.current = true;
          navigate(view.path, { replace: true });
        }
      },
      { rootMargin: "-45% 0px -54% 0px" },
    );
    for (const view of VIEWS) {
      const node = document.getElementById(view.id);
      if (node) observer.observe(node);
    }
    return () => observer.disconnect();
  }, [navigate]);

  return (
    <div className="mx-auto max-w-[92rem] px-3 sm:px-5 lg:px-8">
      <SiteHeader sticky />

      <main className="flex flex-col gap-3 pb-4 pt-3 sm:gap-4">
        {VIEWS.map((view, index) => (
          <div
            key={view.id}
            id={view.id}
            className={cn(
              // Clears the sticky header when jumped to.
              "flex scroll-mt-[6.75rem] flex-col lg:scroll-mt-24",
              // The hero fills the first screen; contact gets room to land on.
              view.id === "home" && "min-h-[calc(100svh-7.25rem)]",
              view.id === "contact" && "min-h-[70svh]",
            )}
          >
            {renderView(index, false)}
          </div>
        ))}
      </main>
    </div>
  );
};

const Index = () => (usePaged() ? <PagedSite /> : <ScrollingSite />);

export default Index;
