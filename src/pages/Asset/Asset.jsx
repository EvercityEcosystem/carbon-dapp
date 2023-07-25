import React, { useEffect, useState } from "react";
import Container from "../../ui/Container/Container";
import { Button, Form, Input, message, Spin, Statistic } from "antd";
import { useParams } from "react-router-dom";
import InputNumber from "../../ui/InputNumber/InputNumber";
import useEcoRegistry from "../../hooks/useEcoRegistry";
import usePolkadot from "../../hooks/usePolkadot";
import styles from "./Aseet.module.less";
import { CopyOutlined } from "@ant-design/icons";

import useAssetStore from "../../hooks/useAssetStore";

const Asset = () => {
  const { id } = useParams();
  const [metaInfo, setMetaInfo] = useState();
  const { fetchMetadataAsset, isAPIReady } = usePolkadot();
  const { pinProjectToIPFS, loading, url } = useEcoRegistry();

  useEffect(() => {
    if (isAPIReady) {
      fetchMetadataAsset(id).then((metadata) => {
        setMetaInfo(metadata);
      });
    }
  }, [id, isAPIReady]);

  const { mode, data: assetData } = useAssetStore((state) => ({
    mode: state.mode,
    data: state.data,
  }));

  const handleSave = async ({ serialNumber, amountOfUnits }) => {
    let projectId = null;

    if (mode === "assetByProject") {
      projectId = metaInfo.symbol.replace(/EVR_CARBONCER_(\d+)_\w+/i, "$1");
    }

    await pinProjectToIPFS({
      projectId,
      mode,
      assetData,
      assetId: id,
      serialNumber,
      amountOfUnits,
      assetName: metaInfo.name,
      assetSymbol: metaInfo?.symbol,
    });
  };

  return (
    <Container>
      <div className={styles.info}>
        <Statistic
          className={styles.name}
          title="Asset symbol"
          value={metaInfo?.symbol}
        />
        <CopyOutlined
          className={styles.copyIcon}
          onClick={() => {
            navigator.clipboard.writeText(metaInfo?.symbol);
            message.success("Asset symbol copied!");
          }}
        />
      </div>
      <Form
        onFinish={handleSave}
        disabled={loading}
        labelAlign="left"
        labelCol={{ span: 14 }}
        wrapperCol={{ span: 10 }}
      >
        {mode === "assetByProject" && (
          <Form.Item
            label="Serial number"
            name="serialNumber"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
        )}
        <Form.Item
          label="Amount of carbon units"
          name="amountOfUnits"
          rules={[{ required: true }]}
        >
          <InputNumber />
        </Form.Item>
        <Form.Item wrapperCol={{ span: 24 }}>
          <Button htmlType="submit" block type="primary">
            Save file
          </Button>
        </Form.Item>
      </Form>
      <Spin spinning={loading} />
      {url && (
        <a target="__blank" href={url}>
          Go to file
        </a>
      )}
    </Container>
  );
};

export default Asset;
