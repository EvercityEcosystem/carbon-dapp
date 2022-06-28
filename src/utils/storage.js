const getCurrentUser = () => ({
  address: localStorage.getItem("userAddress"),
});

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
