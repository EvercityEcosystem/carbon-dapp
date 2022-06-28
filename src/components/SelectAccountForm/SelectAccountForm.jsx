import React from "react";
import { Button, Form, Select } from "antd";

import styles from "./SelectAccountForm.module.less";

const SelectAccountForm = ({ accounts, onSelectAccount }) => {
  return (
    <Form className={styles.loginForm} onFinish={onSelectAccount}>
      <Form.Item label="Choose polkadot account" name="address" required>
        <Select
          options={accounts.map(account => ({
            label: `${account.meta.name} ${account.address}`,
            value: account.address,
          }))}
        />
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit" block>
          Log in
        </Button>
      </Form.Item>
    </Form>
  );
};

export default SelectAccountForm;
