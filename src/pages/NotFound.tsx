import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { ArrowLeft } from "lucide-react";
import { GlassPane } from "@/components/glass/GlassPane";
import { GlassChip } from "@/components/glass/GlassChip";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-dvh items-center justify-center p-6">
      <GlassPane settleIndex={0} className="w-full max-w-md p-8 text-center">
        <p className="eyebrow">Error 404</p>
        <h1 className="mt-2 font-display text-3xl font-bold tracking-[-0.03em] text-ink">
          Nothing at this address
        </h1>
        <p className="mt-3 text-[0.9375rem] leading-relaxed text-ink-2">
          <span className="font-mono text-sm text-ink-3">{location.pathname}</span> doesn't exist.
          The dashboard is back home.
        </p>
        <div className="mt-6 flex justify-center">
          <GlassChip href="/">
            <ArrowLeft className="h-3.5 w-3.5" aria-hidden />
            Back to the dashboard
          </GlassChip>
        </div>
      </GlassPane>
    </div>
  );
};

export default NotFound;
