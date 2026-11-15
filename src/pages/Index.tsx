import { useEffect, useState, type CSSProperties, type ReactNode } from "react";
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

const renderView = (index: number) => {
  const view = VIEWS[index];
  if (view.id === "home") return <Hero />;
  if (view.id === "contact") return <Contact />;
  return <Sheet id={view.id}>{BODIES[view.id]}</Sheet>;
};

/** Padding around a page, shared by the live layer and the one sliding away. */
const LAYER = "flex min-h-0 flex-1 flex-col pb-3 pt-3 sm:pb-5 sm:pt-4 lg:pb-6";

/**
 * The whole site is one frame that shows one page at a time: the hero at `/`,
 * each section at `/<id>`, and contact at `/contact`. There is no long scroll —
 * the header, the pager, or the arrow keys move between pages, and the
 * gradient field (mounted in App) changes colour to match where you are.
 *
 * Changing page slides sideways in nav order: going to a later page, the old
 * one leaves to the left and the new one arrives from the right; going back
 * is the mirror image.
 *
 * Page order and paths live in components/site/sections.ts.
 */
const Index = () => {
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

  // A new page starts at its top (matters on small screens, where a section
  // can be taller than the viewport).
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

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
    <div className="mx-auto flex min-h-dvh max-w-[92rem] flex-col px-3 sm:px-5 lg:h-dvh lg:px-8">
      <SiteHeader />

      <main className="relative flex min-h-0 flex-1 flex-col">
        {slide && (
          // The page being left. Out of flow, so the new page alone sets the
          // height; removed the moment its slide finishes.
          <div
            key={`out-${slide.from}`}
            className={cn(LAYER, "slide-out pointer-events-none absolute inset-0 overflow-hidden")}
            style={dirStyle}
            aria-hidden
          >
            {renderView(slide.from)}
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
          {renderView(index)}
        </div>
      </main>
    </div>
  );
};

export default Index;
