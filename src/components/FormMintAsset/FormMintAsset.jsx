import React from "react";
import { Form } from "antd";
import InputNumber from "../../ui/InputNumber/InputNumber";

const FormMintAsset = ({ form, onFinish }) => {
  return (
    <Form form={form} onFinish={onFinish}>
      <Form.Item
        name="amount"
        label="Amount"
        required
        rules={[
          {
            required: true,
          },
        ]}>
        <InputNumber min={0} />
      </Form.Item>
    </Form>
  );
};

export default FormMintAsset;
