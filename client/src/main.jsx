import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./styles/index.css";
import State from "./context/State.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <State>
      <App />
    </State>
  </StrictMode>
);
