import keyring from "@polkadot/ui-keyring";

const getCurrentUser = () => {
  const rawAddress = localStorage.getItem("userAddress");

  if (!rawAddress) {
    return {};
  }

  const decodedAdress = keyring.decodeAddress(rawAddress);
  const encodedAddress = keyring.encodeAddress(
    decodedAdress,
    import.meta.env.VITE_NETWORK_CODE,
  );

  return {
    address: encodedAddress,
  };
};

const saveCurrentUser = ({ address }) => {
  if (!address) {
    return;
  }

  localStorage.setItem("userAddress", address);
};

const forgetCurrentUser = () => {
  localStorage.removeItem("userAddress");
};

export { getCurrentUser, saveCurrentUser, forgetCurrentUser };
