import { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <main className="mx-auto flex min-h-dvh max-w-xl flex-col justify-center px-6">
      <h1>Nothing at this address</h1>
      <p className="em break-all">{location.pathname} doesn't exist.</p>
      <Link to="/" className="text-link mt-6 self-start">
        Back to home →
      </Link>
    </main>
  );
};

export default NotFound;
