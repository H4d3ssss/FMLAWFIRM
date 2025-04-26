import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import AppTest from "./AppTest.jsx";
import AppTest1 from "./AppTest1.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AppTest />
  </StrictMode>
);
