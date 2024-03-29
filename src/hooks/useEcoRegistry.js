import { useCallback, useReducer } from "react";
import { notification } from "antd";
import usePolkadot from "./usePolkadot";

const ECOREGISTRY_API = "https://api-front.ecoregistry.io/api";
const PINATA_URI = "https://api.pinata.cloud";

const initialState = {
  loading: false,
  url: null,
};

const reducer = (state, action) => {
  switch (action.type) {
    case "setLoading":
      return { ...state, loading: action.payload };
    case "setUrl":
      return { ...state, url: action.payload };
    default:
      return initialState;
  }
};

const useEcoRegistry = () => {
  const [{ loading, url }, dispatch] = useReducer(reducer, initialState);
  const { setProjectData } = usePolkadot();

  const fetchProject = useCallback(
    (id) =>
      fetch(`${ECOREGISTRY_API}/project/public/${id}`, {
        headers: {
          platform: "ecoregistry",
          ln: "eng",
        },
      }).then((res) => res.json()),
    [],
  );

  const pinJSONToIPFS = useCallback(
    (body) =>
      fetch(`${PINATA_URI}/pinning/pinJSONToIPFS`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_PINATA_JWT}`,
        },
        body: JSON.stringify(body),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.error) {
            notification.error({
              message: data.error.reason,
              description: data.error.details,
            });
          }
          if (data.IpfsHash) {
            return `https://gateway.pinata.cloud/ipfs/${data.IpfsHash}`;
          }
        }),
    [],
  );

  const pinProjectToIPFS = async ({
    projectId,
    assetId,
    assetName,
    mode,
    ...values
  }) => {
    let projectFromRegistry = {};

    if (mode === "assetByProject") {
      dispatch({
        type: "setLoading",
        payload: true,
      });

      const projectFromRegistry = await fetchProject(projectId);

      if (projectFromRegistry?.codeMessages?.[0]) {
        notification.error({
          message: "Error on ecoregistry platform",
          description: projectFromRegistry.codeMessages[0].message,
        });

        dispatch({
          type: "setLoading",
          payload: false,
        });

        return;
      }
    }

    const project = {
      ...projectFromRegistry,
      assetId,
      assetName,
      ...values,
    };
    const url = await pinJSONToIPFS(project);

    dispatch({
      type: "setUrl",
      payload: url,
    });
    await setProjectData({
      assetId,
      url,
      project,
      assetName,
    });
    dispatch({
      type: "setLoading",
      payload: false,
    });
  };

  return {
    loading,
    url,
    pinProjectToIPFS,
  };
};

export default useEcoRegistry;
