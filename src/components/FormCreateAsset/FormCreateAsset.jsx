import React from "react";
import { Form, Input } from "antd";

const FormCreateAsset = ({ form, onSubmit }) => {
  return (
    <Form form={form} onFinish={onSubmit} labelCol={{ span: 10 }}>
      <Form.Item
        required
        label="Asset name"
        name="vintageName"
        rules={[{ required: true }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        required
        label="Project ID"
        name="projectId"
        rules={[{ required: true }]}
      >
        <Input />
      </Form.Item>
    </Form>
  );
};

export default FormCreateAsset;
