import React, { useEffect, useState } from "react";
import { Table, Typography } from "antd";
import * as dayjs from "dayjs";

import Button from "../../ui/Button/Button";
import Container from "../../ui/Container/Container";

import { getCurrentUser } from "../../utils/storage";

import styles from "./Transactions.module.less";

const MONITORING_BASE_URL =
  "https://api.subquery.network/sq/nova-wallet/nova-wallet-dao-ipci";
const EXPLORER_BASE_URL =
  "https://polkadot.js.org/apps/?rpc=wss%3A%2F%2Fkusama.rpc.ipci.io#/explorer/query";

const columns = [
  {
    title: "Module",
    render: (data) => data.extrinsic.module,
  },
  {
    title: "Method",
    render: (data) => data.extrinsic.call,
  },
  {
    title: "Date",
    render: (data) => dayjs.unix(data.timestamp).format("DD.MM.YYYY HH:mm"),
  },
  {
    title: "Success",
    render: (data) => (data.extrinsic.success ? "Yes" : "No"),
  },
  {
    title: "See in explorer",
    render: (data) => (
      <Button
        view="action"
        type="primary"
        target="_blank"
        href={`${EXPLORER_BASE_URL}/${data.blockNumber}`}
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
    fetch(`${MONITORING_BASE_URL}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: `
          query GetHistoryElements($address: String!) {
            historyElements(
              filter: {address: {equalTo: $address}, extrinsic: {contains: {module: "carbonAssets"}}}
              orderBy: TIMESTAMP_DESC
            ) {
              nodes {
                address
                blockNumber
                extrinsic
                timestamp
                nodeId
                id
              }
            }
          }
        `,
        variables: {
          address,
        },
      }),
    })
      .then((res) => res.json())
      .then((res) => {
        console.log("res", res);
        const trs = res.data.historyElements.nodes;

        setTransactions(trs);
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
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
