import { useEffect, useRef } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { identity } from "@/data/portfolio";
import { cn } from "@/lib/utils";
import { SECTIONS } from "./sections";

/**
 * Floating nav. On desktop each link opens that section as its own page; in
 * the scrolling layout (`sticky`) it stays pinned and each link jumps to that
 * section. On small screens the section links move to a second, sideways-
 * scrolling row so they are never hidden behind a menu.
 */
export const SiteHeader = ({ sticky }: { sticky?: boolean }) => {
  const { pathname } = useLocation();
  const railRef = useRef<HTMLElement>(null);

  // On phones the section links are a sideways-scrolling row; keep the current
  // one in view so it is never off the edge of the screen.
  useEffect(() => {
    const rail = railRef.current;
    const active = rail?.querySelector<HTMLElement>('[aria-current="page"]');
    if (!rail || !active) return;
    rail.scrollTo({
      left: active.offsetLeft - (rail.clientWidth - active.offsetWidth) / 2,
      behavior: "smooth",
    });
  }, [pathname]);

  return (
    <header
      className={cn("z-40 pt-3 sm:pt-4", sticky ? "sticky top-0" : "relative")}
    >
      <div className="flex items-center justify-between gap-4 rounded-full bg-white py-2 pl-5 pr-2 shadow-[0_0_0_1px_hsl(var(--ink-1)/0.08),0_12px_32px_-14px_hsl(var(--ink-1)/0.5)]">
        <Link
          to="/"
          className="font-display text-[1.0625rem] font-bold tracking-[-0.02em] text-ink"
        >
          {identity.name}
        </Link>

        <nav
          aria-label="Sections"
          className="hidden items-center gap-0.5 lg:flex"
        >
          {SECTIONS.map((section) => (
            <NavLink
              key={section.id}
              to={`/${section.id}`}
              className={({ isActive }) =>
                cn(
                  "rounded-full px-3 py-1.5 text-sm transition-colors",
                  isActive
                    ? "bg-ink text-chalk"
                    : "text-ink-2 hover:bg-ink/[0.07] hover:text-ink",
                )
              }
            >
              {section.nav}
            </NavLink>
          ))}
        </nav>

        <Link
          to="/contact"
          className="pill !py-2 text-sm hover:!bg-coral hover:!text-ink"
        >
          Get in touch
        </Link>
      </div>

      <nav
        ref={railRef}
        aria-label="Sections"
        className="relative -mx-3 mt-2 flex gap-1.5 overflow-x-auto px-3 pb-2 [scrollbar-width:none] sm:-mx-5 sm:px-5 lg:hidden [&::-webkit-scrollbar]:hidden"
      >
        {SECTIONS.map((section) => (
          <NavLink
            key={section.id}
            to={`/${section.id}`}
            className={({ isActive }) =>
              cn(
                "shrink-0 rounded-full px-3.5 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-ink text-chalk"
                  : "bg-white text-ink shadow-[0_0_0_1px_hsl(var(--ink-1)/0.08),0_6px_16px_-10px_hsl(var(--ink-1)/0.6)]",
              )
            }
          >
            {section.nav}
          </NavLink>
        ))}
      </nav>
    </header>
  );
};
