import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

/**
 * The gradient field drifts forever, which is compositor work every frame. A
 * backgrounded tab cannot show any of it, so park the animation there —
 * index.css pauses `.blob` off this attribute.
 */
const syncPageVisibility = () => {
  document.documentElement.dataset.pageHidden = String(document.hidden);
};
syncPageVisibility();
document.addEventListener("visibilitychange", syncPageVisibility);

createRoot(document.getElementById("root")!).render(<App />);
