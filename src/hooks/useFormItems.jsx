import React, { useCallback, useMemo } from "react";
import { set, get } from "unchanged";

import {
  Col,
  Form,
  Input,
  Checkbox,
  Upload,
  message,
  Select,
  Button,
  Divider,
  Tooltip,
  DatePicker,
} from "antd";

import { InfoCircleOutlined } from "@ant-design/icons";

import useXState from "./useXState";
import InputNumber from "../ui/InputNumber/InputNumber";

const { TextArea } = Input;
const { Option } = Select;
const noop = () => {};
const DEFAULT_INPUT_SIZE = "default";
const DEFAULT_MODE = "create";

export const getOptionValue = obj => Object.values(obj).join("_");

const useFormItems = ({
  form,
  initialValues,
  config,
  size = DEFAULT_INPUT_SIZE,
  itemClassName,
  mode = DEFAULT_MODE,
}) => {
  const [state, updateState] = useXState({});

  const sectionsIndex = useMemo(() => {
    const entries = config ? Object.entries(config) : [];

    const sections = entries.reduce((acc, [key, val]) => {
      const { section = "default", subSection = "default" } = val || {};

      return set([section, subSection, key], val, acc);
    }, {});

    return sections;
  }, [config]);

  const parseFile = useCallback(
    (file, callback) => {
      const reader = new FileReader();

      reader.onload = e => {
        try {
          const fileJson = JSON.parse(e.target.result);

          callback(updateState, form, fileJson);
        } catch (err) {
          message.error("JSON is not valid.");
        }
      };

      reader.readAsText(file);

      return false;
    },
    [form, updateState],
  );

  const getInput = useCallback(
    (value, key) => {
      let { disabled } = value;

      if (mode === "update" && value.updateable === false) {
        disabled = true;
      }

      if (value.display === "checkbox") {
        return <Checkbox disabled={disabled} />;
      }

      if (value.display === "file") {
        const propsByAccept = {
          beforeUpload: value.beforeUpload || noop,
        };

        if (!value.accept || value.accept === ".json") {
          propsByAccept.beforeUpload = file =>
            parseFile(file, value.onChange || noop);
        }

        return (
          <Upload
            name={key}
            type="drag"
            accept={value.accept || ".json"}
            showUploadList={value.showUploadList || false}
            multiple={value.multiple}
            action={value.action}
            headers={value.headers}
            onRemove={value.onRemove || noop}
            onDownload={value.onDownload || noop}
            onChange={value.onChange || noop}
            {...propsByAccept}>
            {value.placeholder}
          </Upload>
        );
      }

      if (value.display === "date") {
        return <DatePicker style={{ width: "100%" }} />;
      }

      if (value.display === "select") {
        return (
          <Select
            mode={value.mode || "default"}
            showSearch={value.showSearch}
            placeholder={value.placeholder}
            size={value.size || size}
            allowClear={
              typeof value.allowClear !== "undefined" ? value.allowClear : true
            }
            disabled={disabled}
            tokenSeparators={[",", " "]}
            optionLabelProp={value.optionLabelProp}
            onDropdownVisibleChange={value.onDropdownVisibleChange}
            optionFilterProp={value.optionFilterProp || "value"}>
            {(value.values || []).map(obj => {
              // solution for complex select options
              if (value.optionLabelProp === "label") {
                const optionValue = get("0", Object.keys(obj));
                const optionTitle = get("0", Object.values(obj));

                return (
                  <Option
                    key={optionValue}
                    value={optionValue}
                    label={optionValue}
                    title={optionTitle}>
                    {optionTitle}
                  </Option>
                );
              }

              const optionValue = (getOptionValue(obj) || "").toString();
              const optionTitle = Object.keys(obj).join("_");

              return (
                <Option
                  key={optionValue}
                  value={optionValue}
                  title={optionTitle}>
                  {optionTitle}
                </Option>
              );
            })}
          </Select>
        );
      }

      if (value.display === "text" && value.type === "number") {
        return (
          <InputNumber
            min={value.min}
            max={value.max}
            onChange={
              value.onChange && (number => value.onChange(form, number))
            }
            placeholder={value.placeholder}
            size={value.size || size}
            step={value.step}
            disabled={disabled}
            suffix={
              value.suffix && (
                <Tooltip title={value.suffix}>
                  <InfoCircleOutlined style={{ color: "rgba(0,0,0,.45)" }} />
                </Tooltip>
              )
            }
          />
        );
      }

      if (value.display === "text" && value.type === "string") {
        return (
          <TextArea
            rows={value.rows || 3}
            placeholder={value.placeholder}
            size={value.size || size}
            disabled={disabled}
            autoSize={value.autoSize || false}
          />
        );
      }

      if (value.display === "text" && value.type === "password") {
        return (
          <Input.Password
            size={value.size || size}
            placeholder={value.placeholder}
            disabled={disabled}
          />
        );
      }

      return (
        <Input
          size={value.size || size}
          placeholder={value.placeholder}
          disabled={disabled}
          type={value.type}
          suffix={
            value.suffix && (
              <Tooltip title={value.suffix}>
                <InfoCircleOutlined style={{ color: "rgba(0,0,0,.45)" }} />
              </Tooltip>
            )
          }
        />
      );
    },
    [parseFile, size, mode],
  );

  const getButton = useCallback(
    (value, key) => (
      <Col key={key} span={value.span || 12}>
        <Button
          size={value.size || size}
          disabled={value.disabled}
          icon={value.icon}
          onClick={value.onClick}
          shape={value.shape}
        />
      </Col>
    ),
    [size],
  );

  const getFormItem = useCallback(
    (key, value) => {
      let initialValue = get(key, initialValues);

      if (typeof initialValue === "undefined") {
        initialValue = value.default;
      }

      if (value.display === "button") {
        return getButton(value, key);
      }

      if (value.display === "custom") {
        return value.component;
      }

      if (value.display === "divider") {
        return (
          <Divider orientation={value.orientation || "left"}>
            {value.label}
          </Divider>
        );
      }

      if (initialValue === "") {
        initialValue = undefined;
      } else if (
        typeof initialValue !== "undefined" &&
        initialValue !== null &&
        ["string"].indexOf(value.type) > -1
      ) {
        initialValue = initialValue.toString();
      }

      const rules = [];
      if (value.required) {
        rules.push({
          required: value.required,
          message: `${value.label} is required`,
        });
      }

      if (value.rules && Array.isArray(value.rules)) {
        rules.push(...value.rules);
      }

      return (
        <Col key={key} span={value.span || 12}>
          <Form.Item
            name={key.split(".")}
            key={key}
            className={itemClassName}
            label={value.label}
            required={value.required || false}
            hasFeedback={state[`hasFeedback.${key}`] || false}
            initialValue={initialValue}
            valuePropName={
              (value.display === "checkbox" && "checked") || "value"
            }
            rules={rules}
            shouldUpdate>
            {getInput(value, key)}
          </Form.Item>
        </Col>
      );
    },
    [initialValues, itemClassName, state, getInput, getButton],
  );

  const formItems = useMemo(
    () =>
      Object.entries(config || {})
        .filter(([, value]) => value)
        .map(([key, value]) => getFormItem(key, value)),
    [config, getFormItem],
  );

  return [
    formItems,
    {
      sectionsIndex,
      parseFile,
      getInput,
      getFormItem,
    },
  ];
};

export default useFormItems;
