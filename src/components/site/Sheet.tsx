import type { CSSProperties, ReactNode } from "react";
import { Pager } from "./Pager";
import { SECTIONS, VIEWS, type SectionId } from "./sections";

/**
 * One section, as its own page: a chalk sheet with the section's name on the
 * left and its entries on the right.
 *
 * On large screens the sheet is exactly as tall as the space under the header
 * and only the right column scrolls, so the title and the pager stay put. On
 * small screens it is an ordinary page that ends when the section does.
 */
export const Sheet = ({ id, children }: { id: SectionId; children: ReactNode }) => {
  const section = SECTIONS.find((entry) => entry.id === id)!;
  const index = VIEWS.findIndex((view) => view.id === id);
  const [a, b, c] = section.orb;

  return (
    <section
      aria-labelledby="section-title"
      className="sheet rise flex min-h-0 flex-1 flex-col overflow-hidden lg:grid lg:grid-cols-12"
    >
      <header className="px-5 pt-8 sm:px-9 sm:pt-11 lg:col-span-4 lg:flex lg:flex-col lg:justify-between lg:gap-10 lg:py-14 lg:pl-14 lg:pr-0">
        <div className="flex items-center gap-4 lg:block">
          <span
            className="orb block h-11 w-11 lg:h-16 lg:w-16"
            style={{ "--a": a, "--b": b, "--c": c } as CSSProperties}
            aria-hidden
          />
          <div className="lg:mt-6">
            <h1
              id="section-title"
              className="font-display text-[2rem] font-bold leading-[0.95] tracking-[-0.015em] text-ink sm:text-[2.5rem] lg:text-[3.25rem]"
            >
              {section.title}
            </h1>
            <p className="mt-1.5 max-w-[26ch] text-[0.9375rem] leading-snug text-ink-3 lg:mt-3 lg:text-base">
              {section.note}
            </p>
          </div>
        </div>

        <Pager index={index} className="hidden lg:flex" />
      </header>

      <div className="min-w-0 px-5 py-8 sm:px-9 sm:py-11 lg:col-span-8 lg:overflow-y-auto lg:py-14 lg:pl-10 lg:pr-14">
        {children}
        <Pager index={index} className="mt-10 border-t border-ink/10 pt-6 lg:hidden" />
      </div>
    </section>
  );
};
