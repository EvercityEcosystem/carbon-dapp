import React from "react";
import { Form, Select } from "antd";
import InputNumber from "../../ui/InputNumber/InputNumber";

const FormBurnAsset = ({ form, isCustodian, accounts, onFinish }) => {
  return (
    <Form form={form} onFinish={onFinish} labelCol={{ span: 10 }}>
      {isCustodian && (
        <Form.Item
          name="account"
          label="Select account"
          required
          rules={[
            {
              required: true,
            },
          ]}>
          <Select
            options={accounts.map(account => ({
              label: account,
              value: account,
            }))}
          />
        </Form.Item>
      )}
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

export default FormBurnAsset;
