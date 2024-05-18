import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import MetamaskProvider from "./src/contexts/MetamaskProvider";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <React.StrictMode>
    <MetamaskProvider>
      <App />
    </MetamaskProvider>
  </React.StrictMode>
);
