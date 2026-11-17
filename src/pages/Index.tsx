import { useEffect, useRef, type ReactNode } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Contact } from "@/components/site/Contact";
import { Hero } from "@/components/site/Hero";
import { Section } from "@/components/site/Section";
import { VIEWS, viewIndex, type SectionId } from "@/components/site/sections";
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
  return (
    <Section id={view.id}>
      {BODIES[view.id]}
    </Section>
  );
};

/**
 * One centred page, top to bottom, with no menu. Every section keeps its own
 * URL: opening `/projects` scrolls there, and the URL follows whichever
 * section is in view as you scroll.
 */
const Index = () => {
  const location = useLocation();
  const navigate = useNavigate();
  /* Set just before the scroll-spy rewrites the URL, so the effect below can
     tell "the visitor scrolled here" (leave the scroll alone) from "the
     visitor tapped a link" (go there). */
  const fromSpy = useRef(false);
  const first = useRef(true);

  // The page was opened at a section's URL (or a link changed it): go there.
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

  // Scroll-spy: the URL follows whichever section is crossing the middle of
  // the screen, so a copied link opens where the reader was.
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
    <main>
      {VIEWS.map((view, index) => (
        <div key={view.id} id={view.id}>
          {renderView(index)}
        </div>
      ))}
    </main>
  );
};

export default Index;
