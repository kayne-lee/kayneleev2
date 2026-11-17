import { useEffect, useRef, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { SECTIONS, type SectionId } from "./sections";

/**
 * One section: a bold title and an italic note, then its content, in one
 * column centred on the page with its text left-aligned. Fades up once as it scrolls into view.
 */
export const Section = ({ id, children }: { id: SectionId; children: ReactNode }) => {
  const section = SECTIONS.find((entry) => entry.id === id)!;
  const ref = useRef<HTMLElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true);
          observer.disconnect();
        }
      },
      { rootMargin: "0px 0px -10% 0px" },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={ref}
      aria-labelledby={`${id}-title`}
      className={cn("reveal mx-auto w-full max-w-xl px-6 py-20", shown && "is-in")}
    >
      <header>
        <h2 id={`${id}-title`}>{section.title}</h2>
        <p className="em">{section.note}</p>
      </header>

      <div className="mt-10">{children}</div>
    </section>
  );
};
