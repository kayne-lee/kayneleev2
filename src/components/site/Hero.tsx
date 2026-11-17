import type { CSSProperties } from "react";
import { identity } from "@/data/portfolio";

const delay = (ms: number) => ({ "--rise-delay": `${ms}ms` }) as CSSProperties;

/** The landing screen: a small portrait and a few lines, centred in the window, text left-aligned. */
export const Hero = () => (
  <section
    aria-label="Introduction"
    className="mx-auto flex min-h-svh max-w-xl flex-col justify-center px-6 py-20"
  >
    {/* The LCP candidate. */}
    <img
      src={identity.headshot.img.src}
      srcSet={identity.headshot.sources.webp}
      sizes="40px"
      width={identity.headshot.img.w}
      height={identity.headshot.img.h}
      alt={`Portrait of ${identity.name}`}
      fetchPriority="high"
      decoding="async"
      className="rise block h-10 w-10 rounded-full object-cover object-[50%_28%]"
    />

    <h1 className="rise mt-5" style={delay(100)}>
      {identity.name}
    </h1>
    <p className="rise" style={delay(160)}>
      Software engineer building <strong>agentic systems</strong> and the software that runs them.
    </p>
    <p className="rise em" style={delay(220)}>
      {identity.headline}
      <br />
      {identity.previously}
    </p>

    <nav aria-label="Contact" className="rise mt-6 flex flex-wrap gap-x-5 gap-y-1" style={delay(300)}>
      {identity.links.map((link) => (
        <a
          key={link.href}
          href={link.href}
          target={link.href.startsWith("http") ? "_blank" : undefined}
          rel={link.href.startsWith("http") ? "noreferrer" : undefined}
          className="text-link"
        >
          {link.short}
        </a>
      ))}
    </nav>
  </section>
);
