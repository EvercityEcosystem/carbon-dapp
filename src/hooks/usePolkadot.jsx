import { useCallback, useContext, useMemo, useState } from "react";
import { store } from "../components/PolkadotProvider";
import { connect, getInjector } from "../utils/polkadot";
import { transactionCallback } from "../utils/notify";
import { getCurrentUser } from "../utils/storage";
import { useNavigate } from "react-router-dom";
import { blake2AsHex } from "@polkadot/util-crypto";

const bindKeys = keys => data =>
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
  const navigate = useNavigate();
  const { api, injector, custodian } = polkadotState;

  const toggleLoading = useCallback(() => {
    setLoading(prev => !prev);
  }, [setLoading]);

  const isAPIReady = useMemo(
    () => !!polkadotState?.api?.isConnected && !!polkadotState?.api?.isReady,
    [polkadotState],
  );
  const connectAPI = async () => {
    const api = await connect();
    api.on("error", error => {
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
    api.query.carbonAssets.custodian().then(custodian => {
      dispatch({
        type: "setCustodian",
        payload: custodian.toHuman(),
      });
    });
  }, [api]);

  const createNewAsset = useCallback(async () => {
    const { address } = getCurrentUser();
    toggleLoading();
    try {
      await api.tx.carbonAssets.create().signAndSend(
        address,
        {
          signer: injector.signer,
          nonce: -1,
        },
        transactionCallback(`Create new asset`, block => {
          block.events.forEach(({ event: { data, method, section } }) => {
            if (
              section === "carbonAssets" &&
              method === "Created" &&
              String(data.creator.toHuman()) === String(address)
            ) {
              toggleLoading();
              navigate(`${data.assetId.toNumber()}`);
            }
          });
        }),
      );
    } catch (e) {
      toggleLoading();
      console.log(e);
    }
  }, [api, navigate, toggleLoading]);

  const fetchMetadataAsset = useCallback(
    id =>
      api.query.carbonAssets.metadata(id).then(metadata => metadata.toHuman()),
    [api],
  );

  const setProjectData = useCallback(
    async ({ asset_id, url, project }) => {
      const { address } = getCurrentUser();
      const projectHash = blake2AsHex(JSON.stringify(project));
      try {
        await api.tx.carbonAssets
          .setProjectData(Number(asset_id), url, projectHash)
          .signAndSend(address, {
            signer: injector.signer,
            nonce: -1,
          });
      } catch (e) {
        console.log(e);
      }
    },
    [api],
  );

  const fetchAssets = useCallback(async () => {
    const { address } = getCurrentUser();
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

    const assets = assetsResponse.map(asset => {
      const metadata = metaDataResponse.find(
        metadata => metadata.id === asset.id,
      );
      const balanceRerord = balanceAssets.find(
        balance => balance.account === address && balance.id === asset.id,
      );
      const accounts = balanceAssets
        .filter(balance => balance.id === asset.id)
        .map(balance => balance.account);
      const certificateRecord = burnCertificates.find(
        certificate =>
          certificate.id === asset.id && certificate.account === address,
      );

      return {
        list_accounts: accounts,
        certificates: certificateRecord?.value || 0,
        balance: balanceRerord?.balance || 0,
        url: metadata.url,
        ...asset,
      };
    });
    dispatch({
      type: "setAssets",
      payload: assets,
    });
  }, [api]);

  const mintAsset = useCallback(
    async ({ id, amount }) => {
      const { address } = getCurrentUser();
      console.log({ id, amount });
      try {
        await api.tx.carbonAssets.mint(id, amount).signAndSend(
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
    ({ id, account, amount }) => {
      const { address } = getCurrentUser();
      api.tx.carbonAssets.burn(id, account, amount).signAndSend(
        address,
        {
          signer: injector.signer,
          nonce: -1,
        },
        transactionCallback("Burn carbon asset", () => {
          fetchAssets();
        }),
      );
    },
    [api],
  );

  const selfBurnAsset = useCallback(
    ({ id, amount }) => {
      const { address } = getCurrentUser();
      api.tx.carbonAssets.selfBurn(id, amount).signAndSend(
        address,
        {
          signer: injector.signer,
          nonce: -1,
        },
        transactionCallback("Burn carbon asset", () => {
          fetchAssets();
        }),
      );
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
      const { address } = getCurrentUser();
      try {
        await api.tx.carbonAssets.transfer(id, account, amount).signAndSend(
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
  };
};

export default usePolkadot;
