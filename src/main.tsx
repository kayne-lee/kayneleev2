import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

/**
 * The orbs animate forever behind several frosted panes, which is real GPU work
 * every frame. A backgrounded tab cannot show any of it, so park the animation
 * there — index.css pauses `.orb` off this attribute.
 */
const syncPageVisibility = () => {
  document.documentElement.dataset.pageHidden = String(document.hidden);
};
syncPageVisibility();
document.addEventListener("visibilitychange", syncPageVisibility);

createRoot(document.getElementById("root")!).render(<App />);
