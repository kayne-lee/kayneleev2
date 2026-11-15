import { ArrowLeft, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { VIEWS } from "./sections";

/** Previous / next page, so the site can be read front to back without the nav. */
export const Pager = ({ index, className }: { index: number; className?: string }) => {
  const previous = VIEWS[index - 1];
  const next = VIEWS[index + 1];

  return (
    <nav aria-label="Previous and next page" className={cn("flex flex-wrap gap-2", className)}>
      {previous && (
        <Link to={previous.path} className="tag !gap-1.5 !px-3.5 !py-2 !text-sm font-medium !text-ink hover:bg-ink/[0.06]">
          <ArrowLeft className="h-4 w-4" aria-hidden />
          {previous.label}
        </Link>
      )}
      {next && (
        <Link to={next.path} className="pill !py-2 text-sm hover:!bg-coral hover:!text-ink">
          {next.label}
          <ArrowRight className="h-4 w-4" aria-hidden />
        </Link>
      )}
    </nav>
  );
};
