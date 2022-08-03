import React from "react";
import ReactDOM from "react-dom/client";
import keyring from "@polkadot/ui-keyring";
import { BrowserRouter } from "react-router-dom";
import { cryptoWaitReady } from "@polkadot/util-crypto";

import App from "./App";

import { PolkadotProvider } from "./components/PolkadotProvider";

cryptoWaitReady().then(() => {
  keyring.loadAll({ ss58Format: import.meta.env.VITE_NETWORK_CODE });

  ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
      <BrowserRouter>
        <PolkadotProvider>
          <App />
        </PolkadotProvider>
      </BrowserRouter>
    </React.StrictMode>,
  );
});
