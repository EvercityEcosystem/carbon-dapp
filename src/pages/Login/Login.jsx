import React, { useEffect, useCallback, useContext, useReducer } from "react";

import { useNavigate } from "react-router-dom";
import { web3Accounts } from "@polkadot/extension-dapp";

import { saveCurrentUser } from "../../utils/storage";

import { store } from "../../components/PolkadotProvider";
import SelectAccountForm from "../../components/SelectAccountForm/SelectAccountForm";
import RequestInstall from "../../components/RequestInstall/RequestInstall";
import Container from "../../ui/Container/Container";

const initialState = {
  accounts: [],
  currentAccount: null,
  roles: [],
};

const reducer = (state, action) => {
  switch (action.type) {
    case "setAccounts":
      return { ...state, accounts: action.payload };
    case "setCurrentAccount":
      return { ...state, currentAccount: action.payload };
    case "setRoles":
      return { ...state, roles: action.payload };
    default:
      return state;
  }
};

const Login = () => {
  const navigate = useNavigate();
  const { polkadotState } = useContext(store);
  const [loginState, dispatch] = useReducer(reducer, initialState);

  const checkExtension = useCallback(async () => {
    const allAccounts = await web3Accounts();
    if (allAccounts.length) {
      dispatch({
        type: "setAccounts",
        payload: allAccounts,
      });
    }
  }, []);

  const handleAccountSubmit = async values => {
    const { address } = values;
    saveCurrentUser({ address });
    navigate("/dapp/profile");
  };

  useEffect(() => {
    if (polkadotState.injector) {
      checkExtension();
    }
  }, [checkExtension, polkadotState]);

  let content = <RequestInstall />;

  if (polkadotState.injector) {
    content = (
      <SelectAccountForm
        accounts={loginState.accounts}
        onSelectAccount={handleAccountSubmit}
      />
    );
  }

  return <Container>{content}</Container>;
};

export default Login;
