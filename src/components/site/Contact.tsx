import { ArrowUpRight } from "lucide-react";
import { identity } from "@/data/portfolio";
import { Pager } from "./Pager";
import { VIEWS } from "./sections";

/**
 * The last page. Like the hero it sits straight on the field — by here turned
 * all the way to dusk, so the type is set in mist.
 */
export const Contact = () => (
  <section
    aria-labelledby="contact-title"
    className="rise flex flex-1 flex-col justify-end px-2 pb-6 pt-10 text-mist sm:px-4 sm:pb-8 lg:pb-10"
  >
    <p className="max-w-[44ch] text-lg leading-snug sm:text-xl">
      {identity.headline}
      <span className="block">{identity.previously}</span>
    </p>

    <h1
      id="contact-title"
      className="mt-6 font-display text-[clamp(3.25rem,15vw,15rem)] font-black leading-[0.85] tracking-[-0.015em] [font-stretch:62%] text-mist sm:mt-8"
    >
      Get in touch
    </h1>

    <div className="mt-8 flex flex-wrap items-center justify-between gap-x-6 gap-y-3 sm:mt-10">
      <ul className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
        {identity.links.map((link) => (
          <li key={link.href}>
            <a
              href={link.href}
              target={link.href.startsWith("http") ? "_blank" : undefined}
              rel={link.href.startsWith("http") ? "noreferrer" : undefined}
              className="pill pill-light"
            >
              {link.label}
              <ArrowUpRight className="h-4 w-4" aria-hidden />
            </a>
          </li>
        ))}
      </ul>

      <Pager index={VIEWS.length - 1} className="[&_a]:!text-mist [&_a]:shadow-[inset_0_0_0_1px_hsl(var(--mist)/0.5)] hover:[&_a]:!bg-mist/15" />
    </div>
  </section>
);
