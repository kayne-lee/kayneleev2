import type { CSSProperties } from "react";
import { identity } from "@/data/portfolio";
import { cn } from "@/lib/utils";

export const delay = (ms: number) => ({ "--rise-delay": `${ms}ms` }) as CSSProperties;

/** The three contact links as pills. Shared by every hero layout. */
export const HeroLinks = ({ className, light }: { className?: string; light?: boolean }) => (
  <nav aria-label="Contact" className={cn("flex flex-wrap gap-2", className)}>
    {identity.links.map((link) => (
      <a
        key={link.href}
        href={link.href}
        target={link.href.startsWith("http") ? "_blank" : undefined}
        rel={link.href.startsWith("http") ? "noreferrer" : undefined}
        className={cn("pill", light && "pill-light")}
      >
        <span className="sm:hidden">{link.short}</span>
        <span className="hidden sm:inline">{link.label}</span>
      </a>
    ))}
  </nav>
);

/**
 * The landing page. No sheet here — the name sits straight on the gradient, as
 * large as the viewport allows, because the field is the brand and this is
 * the one place it gets the whole frame.
 */
export const Hero = () => (
  <section aria-label="Introduction" className="flex flex-1 flex-col justify-end px-2 pb-6 pt-10 sm:px-4 sm:pb-8 lg:pb-10">
    <div className="rise flex items-center gap-4 sm:gap-5" style={delay(120)}>
      {/* The LCP candidate. */}
      <img
        src={identity.headshot.img.src}
        srcSet={identity.headshot.sources.webp}
        sizes="(min-width: 640px) 144px, (min-width: 380px) 112px, 80px"
        width={identity.headshot.img.w}
        height={identity.headshot.img.h}
        alt={`Portrait of ${identity.name}`}
        fetchPriority="high"
        decoding="async"
        className="h-20 w-20 shrink-0 rounded-full min-[380px]:h-28 min-[380px]:w-28 object-cover object-[50%_28%] ring-4 ring-mist sm:h-36 sm:w-36"
      />
      <p className="max-w-[30ch] font-display text-[1.0625rem] font-semibold leading-[1.15] min-[380px]:text-[1.25rem] tracking-[-0.01em] text-mist sm:text-[1.75rem] lg:text-[2rem]">
        {identity.headline}
        <span className="mt-2 block font-sans text-base font-medium leading-snug tracking-normal text-mist sm:text-xl max-[379px]:text-sm">
          {identity.previously}
        </span>
      </p>
    </div>

    {/* The line box is only 0.8em tall, so the "y" hangs below it — the bottom
        padding is the descender's depth, which keeps it clear of the links. */}
    <h1
      className="rise mt-6 whitespace-nowrap font-display text-[clamp(4.5rem,24.5vw,23rem)] font-black leading-[0.8] tracking-[-0.02em] [font-stretch:62%] pb-[0.2em] text-mist sm:mt-8"
      style={delay(240)}
    >
      {identity.name}
    </h1>

    <HeroLinks light className="rise mt-4 sm:mt-5" />
  </section>
);
