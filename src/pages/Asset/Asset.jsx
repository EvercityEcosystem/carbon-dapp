import React, { useEffect, useState } from "react";
import Container from "../../ui/Container/Container";
import { Button, Form, Input, Spin } from "antd";
import { useParams } from "react-router-dom";
import InputNumber from "../../ui/InputNumber/InputNumber";
import useEcoRegistry from "../../hooks/useEcoRegistry";
import usePolkadot from "../../hooks/usePolkadot";

const Asset = () => {
  const { id } = useParams();
  const [metaInfo, setMetaInfo] = useState();
  const { fetchMetadataAsset, isAPIReady } = usePolkadot();
  const { pinProjectToIPFS, loading, url } = useEcoRegistry();

  useEffect(() => {
    if (isAPIReady) {
      fetchMetadataAsset(id).then(metadata => {
        setMetaInfo(metadata);
      });
    }
  }, [id, isAPIReady]);

  const handlePrepay = async values => {
    await pinProjectToIPFS({
      asset_id: id,
      asset_name: metaInfo.name,
      ...values,
    });
  };
  return (
    <Container>
      <Form
        onFinish={handlePrepay}
        disabled={loading}
        labelAlign="left"
        labelCol={{ span: 14 }}
        wrapperCol={{ span: 10 }}>
        <Form.Item
          label="Serial number"
          name="serial_number"
          required
          rules={[
            {
              required: true,
            },
          ]}>
          <Input />
        </Form.Item>
        <Form.Item
          label="Project ID"
          name="project_id"
          required
          rules={[
            {
              required: true,
            },
          ]}>
          <InputNumber />
        </Form.Item>
        <Form.Item
          label="Amount of carbon units"
          name="amount_carbon_units"
          required
          rules={[
            {
              required: true,
            },
          ]}>
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
