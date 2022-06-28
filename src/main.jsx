import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

import { BrowserRouter } from "react-router-dom";
import { PolkadotProvider } from "./components/PolkadotProvider";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <PolkadotProvider>
        <App />
      </PolkadotProvider>
    </BrowserRouter>
  </React.StrictMode>,
);
