import ReactDOM from "react-dom/client";
import { App } from "./app";
import "./shared/styles/globals.css"; // Si tira error aquí, cámbialo por "./index.css"

ReactDOM.createRoot(document.getElementById("root")!).render(
  <App />
);