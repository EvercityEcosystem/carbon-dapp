import React, { useContext, useEffect, useMemo } from "react";
import Container from "../../ui/Container/Container";
import { Alert, Button, Form, Modal, Typography } from "antd";
import usePolkadot from "../../hooks/usePolkadot";
import styles from "./Assets.module.less";
import { store } from "../../components/PolkadotProvider";
import TableAssets from "../../components/TableAssets/TableAssets";
import { getCurrentUser } from "../../utils/storage";
import ExternalLink from "../../ui/Link/ExternalLink";
import FormMintAsset from "../../components/FormMintAsset/FormMintAsset";
import FormBurnAsset from "../../components/FormBurnAsset/FormBurmAsset";
import { FireOutlined, SendOutlined } from "@ant-design/icons";
import FormTransferAsset from "../../components/FormTransferAsset/FormTransferAsset";
import FormCreateAsset from "../../components/FormCreateAsset/FormCreateAsset";

const Assets = () => {
  const {
    createNewAsset,
    creatingAsset,
    loading,
    fetchAssets,
    isAPIReady,
    mintAsset,
    burnAsset,
    selfBurnAsset,
    isCustodian,
    transferAsset,
  } = usePolkadot();

  const { polkadotState } = useContext(store);
  const { address } = getCurrentUser();
  const [modal, contextHolder] = Modal.useModal();
  const [formBurn] = Form.useForm();
  const [formMint] = Form.useForm();
  const [formTransfer] = Form.useForm();
  const [formCreate] = Form.useForm();

  useEffect(() => {
    if (isAPIReady) {
      fetchAssets();
    }
  }, [isAPIReady]);

  const assets = useMemo(() => {
    if (isCustodian) {
      return polkadotState?.assets || [];
    }
    return (
      polkadotState?.assets?.filter(
        (asset) =>
          asset.list_accounts.includes(address) || asset.owner === address,
      ) || []
    );
  }, [address, polkadotState, isCustodian]);

  const handleRequest = async () => {
    modal.confirm({
      title: "Create a new asset",
      onOk: (close) => {
        formCreate.validateFields().then(() => {
          close();
          formCreate.submit();
        });
      },
      onCancel: () => formCreate.resetFields(),
      content: (
        <FormCreateAsset
          form={formCreate}
          onSubmit={({ projectId, assetName }) => {
            createNewAsset({ projectId, assetName });
          }}
        />
      ),
    });
  };

  const handleMint = (assetId, assetName) => {
    modal.confirm({
      onOk: (close) => {
        formMint.validateFields().then(() => {
          close();
          formMint.submit();
        });
      },
      title: `Mint asset: ${assetName}`,
      onCancel: () => formMint.resetFields(),
      content: (
        <FormMintAsset
          form={formMint}
          onFinish={() => {
            const amount = formMint.getFieldValue("amount");
            mintAsset({ id: assetId, amount });
          }}
        />
      ),
    });
  };
  const handleBurn = (assetId, accounts, assetName) => {
    modal.confirm({
      title: `Burn asset: ${assetName}`,
      icon: <FireOutlined />,
      onOk: (close) => {
        formBurn.validateFields().then(() => {
          close();
          formBurn.submit();
        });
      },
      onCancel: () => formBurn.resetFields(),
      content: (
        <FormBurnAsset
          form={formBurn}
          accounts={accounts}
          isCustodian={isCustodian}
          onFinish={({ amount, account }) => {
            if (isCustodian) {
              burnAsset({ id: assetId, account, amount });
            }
            if (!isCustodian) {
              selfBurnAsset({ id: assetId, amount });
            }
          }}
        />
      ),
    });
  };

  const handleTransfer = (assetId) => {
    modal.confirm({
      title: `Transfer asset`,
      icon: <SendOutlined />,
      onOk: (close) => {
        formTransfer.validateFields().then(() => {
          close();
          formTransfer.submit();
        });
      },
      onCancel: () => formTransfer.resetFields(),
      content: (
        <FormTransferAsset
          form={formTransfer}
          onFinish={({ amount, account }) => {
            transferAsset({ id: assetId, amount, account });
          }}
        />
      ),
    });
  };

  return (
    <Container justify="start">
      <Typography.Title level={2}>Carbon Assets</Typography.Title>
      {creatingAsset && (
        <Alert
          className={styles.alert}
          showIcon
          message="Go to the external registry for buys and retires/transfers the asset"
          closable
          type="warning"
          action={
            <ExternalLink href="https://www.ecoregistry.io/projects">
              Registry
            </ExternalLink>
          }
        />
      )}
      <TableAssets
        loading={loading}
        className={styles.table}
        assets={assets}
        onMint={handleMint}
        onBurn={handleBurn}
        onTransfer={handleTransfer}
        isCustodian={isCustodian}
      />
      {contextHolder}
      <div className={styles.newBtn}>
        <Button type="primary" onClick={handleRequest} loading={loading}>
          New asset
        </Button>
      </div>
    </Container>
  );
};

export default Assets;
