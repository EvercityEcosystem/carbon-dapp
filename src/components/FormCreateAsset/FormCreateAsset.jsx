import React from "react";
import { Divider, Form, Input, Radio, Space, Tooltip } from "antd";
import { InfoCircleOutlined } from "@ant-design/icons";

import InputNumber from "../../ui/InputNumber/InputNumber";

import useAssetStore from "../../hooks/useAssetStore";

const formItems = [
  // project info
  <Form.Item
    key="companyName"
    label="Project owner company name"
    name="Project owner company name"
    rules={[{ required: true }]}
  >
    <Input />
  </Form.Item>,
  <Form.Item
    key="projectName"
    label="Project name"
    name="Project name"
    rules={[{ required: true }]}
  >
    <Input />
  </Form.Item>,
  <Form.Item
    key="briefDescription"
    label="Brief project description"
    name="Brief project description"
    rules={[{ required: true }]}
  >
    <Input.TextArea />
  </Form.Item>,
  <Form.Item
    key="startingDate"
    label="Project starting date (year)"
    name="Project starting date"
    rules={[{ type: "number", required: true, min: 2000, max: 2100 }]}
  >
    <InputNumber min={2000} max={2100} style={{ width: "100%" }} />
  </Form.Item>,
  <Form.Item
    key="endingDate"
    label="Project ending date (year)"
    name="Project ending date"
    rules={[{ type: "number", required: true, min: 2000, max: 2100 }]}
  >
    <InputNumber min={2000} max={2100} style={{ width: "100%" }} />
  </Form.Item>,
  <Form.Item
    key="anticipatedEmissionReductions"
    label="Anticipated emission reductions"
    name="Anticipated emission reductions"
    rules={[{ required: true }]}
  >
    <Input />
  </Form.Item>,
  <Form.Item
    key="pddName"
    label="PDD name"
    name="PDD name"
    rules={[{ required: true }]}
  >
    <Input />
  </Form.Item>,
  <Form.Item
    key="pddMethodology"
    label="PDD methodology"
    name="PDD methodology"
    rules={[{ required: true }]}
  >
    <Input />
  </Form.Item>,
  <Form.Item
    key="pddPreparationDate"
    label="PDD preparation date"
    name="PDD preparation date"
    rules={[
      {
        required: true,
        pattern: /(0[1-9]|[12][0-9]|3[01])\.(0[1-9]|1[1,2])\.(20)\d{2}/,
        message: "Must be in format DD.MM.YYYY",
      },
    ]}
  >
    <Input />
  </Form.Item>,
  <Divider key="validation">Validation</Divider>,
  <Form.Item
    key="reportNumber"
    label="Report number"
    name="Validation report number"
    rules={[{ required: true }]}
  >
    <Input />
  </Form.Item>,
  <Form.Item
    key="reportIssuanceDate"
    label="Report issuance date"
    name="Report issuance date"
    rules={[
      {
        required: true,
        pattern: /(0[1-9]|[12][0-9]|3[01])\.(0[1-9]|1[1,2])\.(20)\d{2}/,
        message: "Must be in format DD.MM.YYYY",
      },
    ]}
  >
    <Input />
  </Form.Item>,
  <Form.Item
    key="reportTitle"
    label="Report title"
    name="Report title"
    rules={[{ required: true }]}
  >
    <Input />
  </Form.Item>,
  <Form.Item
    key="validator"
    label="Validator"
    name="Validator"
    rules={[{ required: true }]}
  >
    <Input />
  </Form.Item>,
  <Form.Item
    key="standard"
    label="Standard"
    name="Standard"
    rules={[{ required: true }]}
  >
    <Input />
  </Form.Item>,
  <Divider key="verification">Verification</Divider>,
  <Form.Item
    key="verificationReportNumber"
    label="Report number"
    name="Verification report number"
    rules={[{ required: true }]}
  >
    <Input />
  </Form.Item>,
  <Form.Item
    key="verificationReportIssuanceDate"
    label="Report issuance date"
    name="Verification Report issuance date"
    rules={[
      {
        required: true,
        pattern: /(0[1-9]|[12][0-9]|3[01])\.(0[1-9]|1[1,2])\.(20)\d{2}/,
        message: "Must be in format DD.MM.YYYY",
      },
    ]}
  >
    <Input />
  </Form.Item>,
  <Form.Item
    key="reportName"
    label="Report name"
    name="Report name"
    rules={[{ required: true }]}
  >
    <Input />
  </Form.Item>,
  <Form.Item
    key="monitoringPeriod"
    label="Monitoring period"
    name="Monitoring period"
    rules={[{ required: true }]}
  >
    <Input />
  </Form.Item>,
  <Form.Item
    key="verifier"
    label="Verifier"
    name="Verifier"
    rules={[{ required: true }]}
  >
    <Input />
  </Form.Item>,
  <Form.Item
    key="verificationReportStandard"
    label="Standard"
    name="Verification standard"
    rules={[{ required: true }]}
  >
    <Input />
  </Form.Item>,
  <Divider key="ERU">Emission reduction units</Divider>,
  <Form.Item
    key="assetName"
    label="Asset name"
    name="Asset name"
    rules={[{ required: true }]}
  >
    <Input />
  </Form.Item>,
  <Form.Item
    key="vintage"
    label="Vintage"
    name="Vintage"
    rules={[{ required: true }]}
  >
    <Input />
  </Form.Item>,
  <Form.Item
    key="startingSerialNumber"
    label="Starting serial number"
    name="Starting serial number"
    rules={[{ required: true }]}
  >
    <Input
      suffix={
        <Tooltip title="Starting serial number of emission reduction units">
          <InfoCircleOutlined style={{ color: "rgba(0,0,0,.45)" }} />
        </Tooltip>
      }
    />
  </Form.Item>,
  <Form.Item
    key="endingSerialNumber"
    label="Ending serial number"
    name="Ending serial number"
    rules={[{ required: true }]}
  >
    <Input
      suffix={
        <Tooltip title="Ending serial number of emission reduction units">
          <InfoCircleOutlined style={{ color: "rgba(0,0,0,.45)" }} />
        </Tooltip>
      }
    />
  </Form.Item>,
];

const onFinish = (values, submitFunc, storeFunc) => {
  storeFunc(values);
  submitFunc(values);
};

const FormCreateAssetByData = ({ form, onSubmit, setData }) => (
  <Form
    key="form"
    form={form}
    onFinish={(values) => onFinish(values, onSubmit, setData)}
    labelCol={{ span: 10 }}
  >
    {formItems}
  </Form>
);

const FormCreateAssetByProjectID = ({ form, onSubmit, setData }) => (
  <Form
    form={form}
    onFinish={(values) => onFinish(values, onSubmit, setData)}
    labelCol={{ span: 10 }}
  >
    <Form.Item
      required
      label="Asset name"
      name="assetName"
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

const FormCreateAsset = (params) => {
  const { mode, setMode, setData } = useAssetStore();
  let form;

  if (mode === "assetByProject") {
    form = <FormCreateAssetByProjectID setData={setData} {...params} />;
  }

  if (mode === "assetByData") {
    form = <FormCreateAssetByData setData={setData} {...params} />;
  }

  return (
    <Space direction="vertical" size={6} style={{ width: "100%" }}>
      <Radio.Group
        defaultValue={mode}
        buttonStyle="solid"
        onChange={(e) => setMode(e.target.value)}
      >
        <Radio.Button value="assetByData">By Data</Radio.Button>
        <Radio.Button value="assetByProject">By Project ID</Radio.Button>
      </Radio.Group>
      <Divider>Project Info</Divider>
      {form}
    </Space>
  );
};

export default FormCreateAsset;
