import { ApiPromise, WsProvider } from "@polkadot/api";
import { web3FromSource, web3Enable } from "@polkadot/extension-dapp";

import types from "../../types.json";

const wsProvider = new WsProvider(import.meta.env.VITE_WS_PROVIDER_URL);

wsProvider.on("disconnected", () => {
  console.warn("Provider disconnected. Reconnecting...");
});

wsProvider.on("error", error => {
  console.error("Provider error: ", error);
});

const connect = async () =>
  ApiPromise.create({
    provider: wsProvider,
    types,
  });

const getInjector = async () => {
  await web3Enable("Evercity dApp");
  const injector =
    (await web3FromSource(import.meta.env.VITE_EXTENSION_NAME)) || null;

  return injector;
};

export { connect, getInjector };
