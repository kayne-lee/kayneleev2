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
  /** Date range. */
  meta?: string;
  /** Prose form. Use this or `bullets`, not both. */
  body?: string;
  /** Resume form — one achievement per line. */
  bullets?: string[];
  current?: boolean;
  children?: ReactNode;
}

/** One dated record — a job or an activity. Entries are separated by a hairline. */
export const Entry = ({ image, title, subtitle, location, meta, body, bullets, current, children }: EntryProps) => (
  <article className="border-t border-line py-8 first:border-t-0 first:pt-0 last:pb-0">
    <div className="flex items-center gap-3">
      {image && <Mark image={image} sizes="20px" className="h-5 w-5" />}
      <h3 className="min-w-0 flex-1">{subtitle ?? title}</h3>
      {meta && <span className="em shrink-0">{meta}</span>}
    </div>

    {subtitle && (
      <p>
        {title}
        {location && <em> · {location}</em>}
        {current && <em> · current</em>}
      </p>
    )}

    {body && <p className="mt-3">{body}</p>}

    {bullets && (
      <ul className="mt-3 space-y-1.5">
        {bullets.map((point) => (
          <li key={point} className="flex gap-2.5">
            <span className="mt-[0.7em] h-[3px] w-[3px] shrink-0 rounded-full bg-ink-3" aria-hidden />
            {point}
          </li>
        ))}
      </ul>
    )}

    {children}
  </article>
);
