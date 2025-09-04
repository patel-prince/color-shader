import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./styles/design-system.css";
import "./styles/globals.css";
import "./styles/layout.css";
import App from "./App.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
