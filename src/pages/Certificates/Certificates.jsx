import React, { useContext, useEffect, useMemo } from "react";
import Container from "../../ui/Container/Container";
import { Table, Typography } from "antd";
import usePolkadot from "../../hooks/usePolkadot";
import { store } from "../../components/PolkadotProvider";
import { getCurrentUser } from "../../utils/storage";
import styles from "./Certificates.module.less";
import { parseUnits } from "../../utils/converters";

const columns = [
  {
    title: "Asset ID",
    dataIndex: "id",
  },
  {
    title: "Burned amount",
    dataIndex: "value",
    render: (value) => parseUnits(value),
  },
];

const Certificates = () => {
  const { fetchCertificates, isAPIReady, isCustodian, loading } = usePolkadot();
  const { polkadotState } = useContext(store);
  const { address } = getCurrentUser();

  const certificates = useMemo(() => {
    if (isCustodian) {
      return polkadotState.certificates;
    }
    return polkadotState.certificates?.filter((cer) => cer.account === address);
  }, [polkadotState, isCustodian]);

  useEffect(() => {
    if (isAPIReady) {
      fetchCertificates();
    }
  }, [isAPIReady]);

  return (
    <Container justify="start">
      <Typography.Title level={2}>Carbon Certificates</Typography.Title>
      <Table
        size="small"
        loading={loading}
        className={styles.table}
        dataSource={certificates}
        columns={columns}
      />
    </Container>
  );
};

export default Certificates;
