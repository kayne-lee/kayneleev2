import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <main className="flex min-h-dvh flex-col justify-end px-5 pb-10 sm:px-9 sm:pb-14">
      <h1 className="font-display text-[clamp(3rem,12vw,10rem)] font-black leading-[0.85] tracking-[-0.015em] [font-stretch:62%] pb-[0.15em] text-mist">
        Nothing at this address
      </h1>
      <p className="mt-6 max-w-[52ch] text-lg leading-relaxed text-mist">
        <span className="break-all font-semibold">{location.pathname}</span> doesn't exist. Everything on this site
        lives on the home page.
      </p>
      <div className="mt-7">
        <a href="/" className="pill pill-light">
          <ArrowLeft className="h-4 w-4" aria-hidden />
          Back to the home page
        </a>
      </div>
    </main>
  );
};

export default NotFound;
