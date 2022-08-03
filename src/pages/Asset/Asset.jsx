import React, { useEffect, useState } from "react";
import Container from "../../ui/Container/Container";
import { Button, Form, Input, message, Spin, Statistic } from "antd";
import { useParams } from "react-router-dom";
import InputNumber from "../../ui/InputNumber/InputNumber";
import useEcoRegistry from "../../hooks/useEcoRegistry";
import usePolkadot from "../../hooks/usePolkadot";
import styles from "./Aseet.module.less";
import { CopyOutlined } from "@ant-design/icons";

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

  const handleSave = async ({ serialNumber, amountUnits }) => {
    const projectId = metaInfo.name.replace(/Evercity_SC_(\d+)_\w+/i, "$1");
    await pinProjectToIPFS({
      projectId,
      serial_number: serialNumber,
      amount_of_units: amountUnits,
      asset_id: id,
      asset_name: metaInfo.name,
    });
  };
  return (
    <Container>
      <div className={styles.info}>
        <Statistic
          className={styles.name}
          title="Asset name"
          value={metaInfo?.name}
        />
        <CopyOutlined
          className={styles.copyIcon}
          onClick={() => {
            navigator.clipboard.writeText(metaInfo?.name);
            message.success("Asset name copied!");
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
        <Form.Item
          label="Serial number"
          name="serialNumber"
          required
          rules={[
            {
              required: true,
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Amount of carbon units"
          name="amountUnits"
          required
          rules={[
            {
              required: true,
            },
          ]}
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
