import "./index.css";
import { createRoot } from "react-dom/client";
import { Popup } from "./Popup.jsx";

const rootEl = document.getElementById("root");
if (rootEl) createRoot(rootEl).render(<Popup />);
