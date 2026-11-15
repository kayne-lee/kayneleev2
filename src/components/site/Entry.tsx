import type { ReactNode } from "react";
import type { Picture } from "@/assets/images";
import { Mark } from "./Mark";

interface EntryProps {
  image?: Picture;
  title: string;
  /** Company or organization. */
  subtitle?: string;
  /** City, shown after the organization. */
  location?: string;
  /** Date range, right-aligned so every date scans down one edge. */
  meta?: string;
  /** Prose form. Use this or `bullets`, not both. */
  body?: string;
  /** Resume form — one achievement per line. */
  bullets?: string[];
  current?: boolean;
  children?: ReactNode;
}

/** One dated record — a job or an activity. Entries are separated by a rule. */
export const Entry = ({ image, title, subtitle, location, meta, body, bullets, current, children }: EntryProps) => (
  <article className="flex flex-col gap-4 border-t border-ink/10 py-7 first:border-t-0 first:pt-0 last:pb-0 sm:flex-row sm:gap-5">
    {image && <Mark image={image} sizes="(min-width: 640px) 56px, 48px" className="h-12 w-12 sm:h-14 sm:w-14" />}

    <div className="min-w-0 flex-1">
      <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-0.5">
        <h3 className="font-display text-xl font-semibold leading-tight tracking-[-0.02em] text-ink sm:text-[1.375rem]">
          {title}
        </h3>
        {meta && <span className="text-sm tabular-nums text-ink-3">{meta}</span>}
      </div>

      {subtitle && (
        <p className="mt-1 flex flex-wrap items-center gap-x-2 text-[0.9375rem] text-ink-3">
          <span className="font-medium text-ink">{subtitle}</span>
          {location && <span>{location}</span>}
          {current && (
            <span className="inline-flex items-center gap-1.5 font-medium text-ink">
              <span className="now-dot" aria-hidden />
              Current
            </span>
          )}
        </p>
      )}

      {body && <p className="mt-3 max-w-[70ch] text-[0.9688rem] leading-[1.65] text-ink-2">{body}</p>}

      {bullets && (
        <ul className="mt-3 max-w-[70ch] space-y-2">
          {bullets.map((point) => (
            <li key={point} className="flex gap-3 text-[0.9688rem] leading-[1.6] text-ink-2">
              <span className="mt-[0.62em] h-1.5 w-1.5 shrink-0 rounded-full bg-coral" aria-hidden />
              {point}
            </li>
          ))}
        </ul>
      )}

      {children}
    </div>
  </article>
);
