import { GlassPane } from "@/components/glass/GlassPane";
import { GlassChip } from "@/components/glass/GlassChip";
import { identity } from "@/data/portfolio";

/**
 * The identity bar. A single pane floating clear of every edge, so the ground
 * is visible around it — that margin is what establishes "glass on a surface"
 * before you read a single word.
 */
export const DashboardHeader = () => (
  <GlassPane
    frost
    settleIndex={0}
    className="flex flex-col gap-4 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:gap-6 sm:px-6"
  >
    <div className="flex min-w-0 items-center gap-4">
      <div className="glass-well h-14 w-14 shrink-0 rounded-full sm:h-16 sm:w-16">
        <img
          src={identity.headshot}
          alt=""
          className="h-full w-full object-cover"
          width={64}
          height={64}
        />
      </div>

      <div className="min-w-0">
        <h1 className="font-display text-[1.375rem] font-bold leading-none tracking-[-0.03em] text-ink sm:text-2xl">
          {identity.name}
        </h1>
        <p className="mt-1.5 text-sm leading-snug text-ink-2">
          <span className="font-medium text-ink">{identity.role}</span>
          <span className="text-ink-3"> · {identity.company}</span>
        </p>
        <p className="eyebrow mt-1">{identity.study}</p>
      </div>
    </div>

    <nav aria-label="Contact" className="flex flex-wrap items-center gap-2">
      {identity.links.map((link) => (
        <GlassChip key={link.href} href={link.href}>
          <span className="sm:hidden">{link.short}</span>
          <span className="hidden sm:inline">{link.label}</span>
        </GlassChip>
      ))}
    </nav>
  </GlassPane>
);
