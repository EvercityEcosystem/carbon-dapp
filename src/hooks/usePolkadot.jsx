import { useCallback, useContext, useMemo, useState } from "react";
import { store } from "../components/PolkadotProvider";
import { connect, getInjector } from "../utils/polkadot";
import { transactionCallback } from "../utils/notify";
import { getCurrentUser } from "../utils/storage";
import { useNavigate } from "react-router-dom";
import { blake2AsHex } from "@polkadot/util-crypto";
import { formatUnits } from "../utils/converters";
import { hexToString, isHex } from "@polkadot/util";

const normalizeMeta = (metadata = {}) => {
  const normalizedMeta = metadata.toHuman
    ? { ...metadata.toHuman() }
    : { ...metadata };

  if (isHex(normalizedMeta?.name)) {
    normalizedMeta.name = hexToString(normalizedMeta.name);
  }

  if (isHex(normalizedMeta?.symbol)) {
    normalizedMeta.symbol = hexToString(normalizedMeta.symbol);
  }

  return normalizedMeta;
};

const bindKeys = (keys) => (data) =>
  data.map(([option, value]) => {
    const record = {};
    keys.forEach((key, index) => {
      record[key] = option.toHuman()[index];
    });
    const valueForHuman = value.toHuman();

    if (typeof valueForHuman === "object") {
      return {
        ...record,
        ...valueForHuman,
      };
    }
    return {
      ...record,
      value: valueForHuman,
    };
  });

const usePolkadot = () => {
  const { polkadotState, dispatch } = useContext(store);
  const [loading, setLoading] = useState(false);
  const [creatingAsset, setCreatingAsset] = useState(false);
  const navigate = useNavigate();
  const { api, injector, custodian } = polkadotState;

  const toggleLoading = useCallback(() => {
    setLoading((prev) => !prev);
  }, [setLoading]);

  const isAPIReady = useMemo(
    () => !!polkadotState?.api?.isConnected && !!polkadotState?.api?.isReady,
    [polkadotState],
  );
  const connectAPI = async () => {
    const api = await connect();
    api.on("error", (error) => {
      console.error("API error: ", error);
    });

    dispatch({
      type: "setAPI",
      payload: api,
    });
  };

  const setInjector = async () => {
    const injector = await getInjector();
    dispatch({
      type: "setInjector",
      payload: injector,
    });
  };

  const initAPI = useCallback(() => {
    connectAPI();
    setInjector();
  }, [connectAPI, setInjector, dispatch]);

  const fetchCustodian = useCallback(() => {
    api.query.carbonAssets.custodian().then((custodian) => {
      dispatch({
        type: "setCustodian",
        payload: custodian.toHuman(),
      });
    });
  }, [api]);

  const createNewAsset = useCallback(
    async ({ projectId, vintageName }) => {
      const { address } = getCurrentUser();
      toggleLoading();
      setCreatingAsset(true);
      try {
        const transformedName = `Evercity_SC_${projectId}_${vintageName}`;
        const transformedSymbol = `EVR_SC_${projectId}_${vintageName}`;
        await api.tx.carbonAssets
          .create(transformedName, transformedSymbol)
          .signAndSend(
            address,
            {
              signer: injector.signer,
              nonce: -1,
            },
            transactionCallback(`Create new asset`, (block) => {
              block.events.forEach(({ event: { data, method, section } }) => {
                if (
                  section === "carbonAssets" &&
                  method === "Created" &&
                  String(data.creator.toHuman()) === String(address)
                ) {
                  toggleLoading();
                  setCreatingAsset(false);
                  navigate(`${data.assetId}`);
                }
              });
            }),
          );
      } catch (e) {
        toggleLoading();
        setCreatingAsset(false);
        console.log(e);
      }
    },
    [api, navigate, toggleLoading],
  );

  const fetchMetadataAsset = useCallback(
    (id) => api.query.carbonAssets.metadata(id).then(normalizeMeta),
    [api],
  );

  const setProjectData = useCallback(
    async ({ assetId, url, project, assetName }) => {
      const { address } = getCurrentUser();
      const projectHash = blake2AsHex(JSON.stringify(project));
      try {
        await api.tx.carbonAssets
          .setProjectData(assetId, url, projectHash)
          .signAndSend(
            address,
            {
              signer: injector.signer,
              nonce: -1,
            },
            transactionCallback(`${assetName} was pined to IPFS`, () => {
              fetchAssets();
            }),
          );
      } catch (e) {
        console.log(e);
      }
    },
    [api],
  );

  const fetchAssets = useCallback(async () => {
    const { address } = getCurrentUser();
    toggleLoading();
    const assetsResponse = await api.query.carbonAssets.asset
      .entries()
      .then(bindKeys(["id"]));

    const metaDataResponse = await api.query.carbonAssets.metadata
      .entries()
      .then(bindKeys(["id"]));

    const balanceAssets = await api.query.carbonAssets.account
      .entries()
      .then(bindKeys(["id", "account"]));

    const burnCertificates = await api.query.carbonAssets.burnCertificate
      .entries()
      .then(bindKeys(["account", "id"]));

    const assets = assetsResponse.map((asset) => {
      const metadata = metaDataResponse
        .map(normalizeMeta)
        .find((metadata) => metadata.id === asset.id);
      const balanceRerord = balanceAssets.find(
        (balance) => balance.account === address && balance.id === asset.id,
      );
      const accounts = balanceAssets
        .filter((balance) => balance.id === asset.id)
        .map((balance) => balance.account);

      const certificateRecord = burnCertificates.find(
        (certificate) =>
          certificate.id === asset.id && certificate.account === address,
      );

      return {
        certificates: certificateRecord?.value || 0,
        list_accounts: accounts,
        balance: balanceRerord?.balance || 0,
        metadata,
        ...asset,
      };
    });
    dispatch({
      type: "setAssets",
      payload: assets,
    });
    toggleLoading();
  }, [api]);

  const mintAsset = useCallback(
    async ({ id, amount }) => {
      const { address } = getCurrentUser();
      const formattedAmount = formatUnits(amount);
      try {
        await api.tx.carbonAssets.mint(id, formattedAmount).signAndSend(
          address,
          {
            signer: injector.signer,
            nonce: -1,
          },
          transactionCallback("Mint carbon asset", () => {
            fetchAssets();
          }),
        );
      } catch (e) {
        console.log(e);
      }
    },
    [api],
  );

  const burnAsset = useCallback(
    async ({ id, account, amount }) => {
      const { address } = getCurrentUser();
      const formattedAmount = formatUnits(amount);
      try {
        await api.tx.carbonAssets
          .burn(id, account, formattedAmount)
          .signAndSend(
            address,
            {
              signer: injector.signer,
              nonce: -1,
            },
            transactionCallback("Burn carbon asset", () => {
              fetchAssets();
            }),
          );
      } catch (e) {
        console.log(e);
      }
    },
    [api],
  );

  const selfBurnAsset = useCallback(
    async ({ id, amount }) => {
      const { address } = getCurrentUser();
      const formattedAmount = formatUnits(amount);
      try {
        await api.tx.carbonAssets.selfBurn(id, formattedAmount).signAndSend(
          address,
          {
            signer: injector.signer,
            nonce: -1,
          },
          transactionCallback("Burn carbon asset", () => {
            fetchAssets();
          }),
        );
      } catch (e) {
        console.log(e);
      }
    },
    [api],
  );

  const isCustodian = useMemo(() => {
    if (isAPIReady) {
      fetchCustodian();
    }
    const { address } = getCurrentUser();
    return custodian === address;
  }, [isAPIReady, custodian]);

  const transferAsset = useCallback(
    async ({ id, account, amount }) => {
      const formattedAmount = formatUnits(amount);
      const { address } = getCurrentUser();
      try {
        await api.tx.carbonAssets
          .transfer(id, account, formattedAmount)
          .signAndSend(
            address,
            {
              signer: injector.signer,
              nonce: -1,
            },
            transactionCallback("Transfer carbon asset", () => {
              fetchAssets();
            }),
          );
      } catch (e) {
        console.log(e);
      }
    },
    [api],
  );

  const fetchCertificates = useCallback(async () => {
    toggleLoading();
    const burnCertificates = await api.query.carbonAssets.burnCertificate
      .entries()
      .then(bindKeys(["account", "id"]));

    dispatch({
      type: "setCertificates",
      payload: burnCertificates,
    });
    toggleLoading();
  }, [api, isCustodian]);

  return {
    initAPI,
    isAPIReady,
    loading,
    createNewAsset,
    fetchMetadataAsset,
    setProjectData,
    fetchAssets,
    fetchCustodian,
    mintAsset,
    burnAsset,
    selfBurnAsset,
    isCustodian,
    transferAsset,
    creatingAsset,
    fetchCertificates,
  };
};

export default usePolkadot;
