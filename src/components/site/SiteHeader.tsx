import { Link, NavLink } from "react-router-dom";
import { identity } from "@/data/portfolio";
import { cn } from "@/lib/utils";
import { SECTIONS } from "./sections";

/**
 * Floating nav, present on every page. Each link opens that section as its
 * own page. On small screens the section links move to a second, sideways-
 * scrolling row so they are never hidden behind a menu.
 */
export const SiteHeader = () => (
  <header className="relative z-40 pt-3 sm:pt-4">
    <div className="flex items-center justify-between gap-4 rounded-full bg-white py-2 pl-5 pr-2 shadow-[0_0_0_1px_hsl(var(--ink-1)/0.08),0_12px_32px_-14px_hsl(var(--ink-1)/0.5)]">
      <Link to="/" className="font-display text-[1.0625rem] font-bold tracking-[-0.02em] text-ink">
        {identity.name}
      </Link>

      <nav aria-label="Sections" className="hidden items-center gap-0.5 lg:flex">
        {SECTIONS.map((section) => (
          <NavLink
            key={section.id}
            to={`/${section.id}`}
            className={({ isActive }) =>
              cn(
                "rounded-full px-3 py-1.5 text-sm transition-colors",
                isActive ? "bg-ink text-chalk" : "text-ink-2 hover:bg-ink/[0.07] hover:text-ink",
              )
            }
          >
            {section.nav}
          </NavLink>
        ))}
      </nav>

      <Link to="/contact" className="pill !py-2 text-sm hover:!bg-coral hover:!text-ink">
        Get in touch
      </Link>
    </div>

    <nav
      aria-label="Sections"
      className="-mx-3 mt-2 flex gap-1.5 overflow-x-auto px-3 pb-1 [scrollbar-width:none] sm:-mx-5 sm:px-5 lg:hidden [&::-webkit-scrollbar]:hidden"
    >
      {SECTIONS.map((section) => (
        <NavLink
          key={section.id}
          to={`/${section.id}`}
          className={({ isActive }) =>
            cn(
              "shrink-0 rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors",
              isActive ? "bg-ink text-chalk" : "bg-white/85 text-ink",
            )
          }
        >
          {section.nav}
        </NavLink>
      ))}
    </nav>
  </header>
);
