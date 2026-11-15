import type { CSSProperties, ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Pager } from "./Pager";
import { SECTIONS, VIEWS, type SectionId } from "./sections";

interface SheetProps {
  id: SectionId;
  /**
   * True on desktop, where each section is its own screen: the sheet is
   * exactly as tall as the space under the header, only the right column
   * scrolls, and a previous/next pager is shown.
   * False in the scrolling layout (phones, tablets, short windows), where the
   * sheet is simply as tall as its content and the next section follows it.
   */
  paged: boolean;
  children: ReactNode;
}

/** One section: a chalk sheet with its name beside (or above) its entries. */
export const Sheet = ({ id, paged, children }: SheetProps) => {
  const section = SECTIONS.find((entry) => entry.id === id)!;
  const index = VIEWS.findIndex((view) => view.id === id);
  const [a, b, c] = section.orb;
  // The page's main heading when it is the only thing on screen; one of
  // several section headings when they are all stacked on one page.
  const Title = paged ? "h1" : "h2";

  return (
    <section
      aria-labelledby={`${id}-title`}
      className={cn(
        "sheet flex flex-col lg:grid lg:grid-cols-12",
        paged && "rise min-h-0 flex-1 overflow-hidden",
      )}
    >
      <header
        className={cn(
          "px-5 pt-8 sm:px-9 sm:pt-11 lg:col-span-4 lg:py-14 lg:pl-14 lg:pr-0",
          paged && "lg:flex lg:flex-col lg:justify-between lg:gap-10",
        )}
      >
        <div className={cn("flex items-center gap-4 lg:block", !paged && "lg:sticky lg:top-28")}>
          <span
            className="orb block h-11 w-11 lg:h-16 lg:w-16"
            style={{ "--a": a, "--b": b, "--c": c } as CSSProperties}
            aria-hidden
          />
          <div className="lg:mt-6">
            <Title
              id={`${id}-title`}
              className="font-display text-[2rem] font-bold leading-[0.95] tracking-[-0.015em] text-ink sm:text-[2.5rem] lg:text-[3.25rem]"
            >
              {section.title}
            </Title>
            <p className="mt-1.5 max-w-[26ch] text-[0.9375rem] leading-snug text-ink-3 lg:mt-3 lg:text-base">
              {section.note}
            </p>
          </div>
        </div>

        {paged && <Pager index={index} />}
      </header>

      {/* A flex column so a section can opt in to filling the sheet's height
          (`flex-1`); sections that don't just stack from the top. */}
      <div
        className={cn(
          "flex min-w-0 flex-col px-5 py-8 sm:px-9 sm:py-11 lg:col-span-8 lg:py-14 lg:pl-10 lg:pr-14",
          paged && "overflow-y-auto",
        )}
      >
        {children}
      </div>
    </section>
  );
};
