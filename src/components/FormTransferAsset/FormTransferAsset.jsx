import React from "react";
import { Form, Input } from "antd";
import InputNumber from "../../ui/InputNumber/InputNumber";

const FormTransferAsset = ({ form, onFinish }) => {
  return (
    <Form form={form} onFinish={onFinish} labelCol={{ span: 10 }}>
      <Form.Item
        name="account"
        label="Account"
        required
        rules={[
          {
            required: true,
          },
        ]}>
        <Input />
      </Form.Item>
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

export default FormTransferAsset;
