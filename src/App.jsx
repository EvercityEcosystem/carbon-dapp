import React, { useEffect } from "react";
import { Navigate, Route, Routes } from "react-router-dom";

import "./app.less";

import Loader from "./ui/Loader/Loader";
import usePolkadot from "./hooks/usePolkadot";

import Layout from "./ui/Layout/Layout";
import Login from "./pages/Login/Login";
import Logout from "./pages/Logout/Logout";
import ProtectedRouter from "./components/ProtectedRouter/ProtectedRouter";
import Assets from "./pages/Assets/Assets";
import Profile from "./pages/Profile/Profile";
import Asset from "./pages/Asset/Asset";
import Certificates from "./pages/Certificates/Certificates";
import Transactions from "./pages/Transactions/Transactions";

function App() {
  const { initAPI, isAPIReady } = usePolkadot();

  useEffect(() => {
    initAPI();
  }, []);

  return (
    <Loader spinning={!isAPIReady} tip="Connecting to blockchain node">
      <Layout>
        <Routes>
          <Route index element={<Navigate to="/dapp/assets" replace />} />
          <Route path="login" element={<Login />} />
          <Route path="logout" element={<Logout />} />
          <Route path="dapp" element={<ProtectedRouter />}>
            <Route index element={<Navigate to="/dapp/assets" replace />} />
            <Route path="profile" element={<Profile />} />
            <Route path="certificates" element={<Certificates />} />
            <Route path="transactions" element={<Transactions />} />
            <Route path="assets">
              <Route index element={<Assets />} />
              <Route path=":id" element={<Asset />} />
            </Route>
          </Route>
        </Routes>
      </Layout>
    </Loader>
  );
}

export default App;
