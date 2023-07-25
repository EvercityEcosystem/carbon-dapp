import React, { useEffect, useState } from "react";
import { Table, Typography } from "antd";
import * as dayjs from "dayjs";

import Button from "../../ui/Button/Button";
import Container from "../../ui/Container/Container";

import { getCurrentUser } from "../../utils/storage";

import styles from "./Transactions.module.less";

const MONITORING_BASE_URL = "https://api.polkaholic.io/account/extrinsics";
const EXPLORER_BASE_URL =
  "https://polkadot.js.org/apps/?rpc=wss%3A%2F%2Fkusama.rpc.ipci.io#/explorer/query";

const columns = [
  {
    title: "Chain name",
    dataIndex: "chainName",
  },
  {
    title: "Method",
    dataIndex: "method",
  },
  {
    title: "Fee",
    render: (data) => `${data.fee} ${data.chainSymbol}`,
  },
  {
    title: "Date",
    render: (data) => dayjs.unix(data.ts).format("DD.MM.YYYY HH:mm"),
  },
  {
    title: "See on explorer",
    render: (data) => (
      <Button
        view="action"
        type="primary"
        target="_blank"
        href={`${EXPLORER_BASE_URL}/${data.blockHash}`}
      >
        Open
      </Button>
    ),
  },
];

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const { address } = getCurrentUser();

  useEffect(() => {
    if (loading || transactions.length) {
      return;
    }

    setLoading(true);
    fetch(`${MONITORING_BASE_URL}/${address}`, {
      // headers: {
      //   Authorization: import.meta.env.VITE_MONITORING_JWT,
      // },
    })
      .then((res) => res.json())
      .then((res) => {
        const trs = res.data.filter((item) => item.section === "carbonAssets");

        setTransactions(trs);
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setLoading(false);
      });
  }, [address, transactions, loading]);

  return (
    <Container justify="start">
      <Typography.Title level={2}>Transactions</Typography.Title>
      <Table
        size="small"
        loading={loading}
        className={styles.table}
        dataSource={transactions}
        columns={columns}
      />
    </Container>
  );
};

export default Transactions;
