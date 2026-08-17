import type { ReactNode } from "react";
import { GlassPane } from "@/components/glass/GlassPane";
import { GlassWell } from "@/components/glass/GlassWell";

interface RecordCardProps {
  image?: string;
  title: string;
  /** Company, organization, or school. */
  subtitle?: string;
  /** Date range — always mono, always right-aligned. */
  meta?: string;
  /** City, right-aligned under the date. */
  location?: string;
  /** Prose form. Use this or `bullets`, not both. */
  body?: string;
  /** Resume form — one achievement per line. */
  bullets?: string[];
  /** Marks the live one with the accent dot. */
  current?: boolean;
  children?: ReactNode;
}

/**
 * One entry inside an opened section — a job, an activity, a project.
 *
 * Two columns in the header: what it was on the left, when and where on the
 * right. That is how a resume reads, and it keeps every date scannable down
 * one edge instead of buried mid-line.
 *
 * Depth 3: the innermost glass. The field still has to show through it, or
 * the card stops belonging to the page.
 */
export const RecordCard = ({
  image,
  title,
  subtitle,
  meta,
  location,
  body,
  bullets,
  current,
  children,
}: RecordCardProps) => (
  <GlassPane depth={3} className="p-4 sm:p-5">
    <div className="flex flex-col gap-4 sm:flex-row">
      {image && <GlassWell src={image} alt="" className="h-14 w-14 rounded-2xl sm:h-16 sm:w-16" />}

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-0.5">
          {subtitle && (
            <span className="flex items-center gap-2 font-mono text-[0.6875rem] uppercase tracking-[0.1em] text-ink-2">
              {current && <span className="live-dot" aria-label="Current" />}
              {subtitle}
            </span>
          )}
          {meta && (
            <span className="font-mono text-[0.6875rem] uppercase tracking-[0.08em] text-ink-3">
              {meta}
            </span>
          )}
        </div>

        <div className="mt-0.5 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-0.5">
          <h3 className="font-display text-lg font-semibold tracking-[-0.02em] text-ink sm:text-xl">
            {title}
          </h3>
          {location && (
            <span className="font-mono text-[0.6875rem] uppercase tracking-[0.08em] text-ink-3">
              {location}
            </span>
          )}
        </div>

        {body && <p className="mt-2 text-[0.9375rem] leading-relaxed text-ink-2">{body}</p>}

        {bullets && (
          <ul className="mt-3 space-y-1.5">
            {bullets.map((point) => (
              <li key={point} className="flex gap-2.5 text-[0.9375rem] leading-relaxed text-ink-2">
                <span
                  className="mt-[0.6em] h-1 w-1 shrink-0 rounded-full bg-[hsl(var(--accent)/0.6)]"
                  aria-hidden
                />
                {point}
              </li>
            ))}
          </ul>
        )}

        {children}
      </div>
    </div>
  </GlassPane>
);
