import React from "react";
import { Link, useNavigate } from "react-router-dom";

import { Layout as BaseLayout, Button } from "antd";

import MenuView from "../MenuView/MenuView";

import { getCurrentUser } from "../../utils/storage";

import styles from "./Layout.module.less";
import logoUrl from "/images/logo-header.svg";

const { Sider, Header, Content, Footer } = BaseLayout;

const Layout = ({ children }) => {
  const location = useNavigate();

  let routes = [];

  const { address } = getCurrentUser();
  if (address) {
    routes = [
      {
        key: "profile",
        path: "/dapp/profile",
        title: "Profile",
      },
      {
        key: "logout",
        path: "/logout",
        title: "Logout",
      },
    ];
  }

  let siderRoutes = [
    {
      path: "/dapp/assets",
      title: "Assets",
    },
  ];

  routes = routes.map(item => {
    if (item.path === location) {
      return { ...item, active: true };
    }

    return item;
  });

  siderRoutes = siderRoutes.map(item => {
    if (item.path === location) {
      return { ...item, active: true };
    }

    return item;
  });

  return (
    <BaseLayout>
      <Header className={styles.header}>
        <div className={styles.headerContent}>
          <div className={styles.logoWrapper}>
            <Link to="/">
              <img src={logoUrl} className={styles.logo} alt="" />
            </Link>
          </div>
          <div className={styles.navWrapper}>
            {!address && (
              <div>
                <Link to="/login">
                  <Button className={styles.navButton} type="primary">
                    Log in
                  </Button>
                </Link>
              </div>
            )}
            {!!routes.filter(Boolean).length && (
              <MenuView
                theme="dark"
                mode="horizontal"
                className={styles.navigation}
                nodes={routes.filter(Boolean)}
              />
            )}
          </div>
        </div>
      </Header>
      <BaseLayout className={styles.contentLayout}>
        {!!address && (
          <Sider theme="light" className={styles.sider}>
            <MenuView
              theme="light"
              mode="vertical"
              className={styles.navigation}
              nodes={siderRoutes}
            />
          </Sider>
        )}
        <Content className={styles.content}>{children}</Content>
      </BaseLayout>
      <Footer className={styles.footer}>© 2022 Evercity PTE LTD</Footer>
    </BaseLayout>
  );
};

export default Layout;
