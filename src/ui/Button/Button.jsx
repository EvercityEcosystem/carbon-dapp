import React from "react";
import { Button as BaseButton } from "antd";
import classnames from "classnames";
import styles from "./Button.module.less";

const viewToSize = {
  action: "small",
};

const Button = ({ view = "default", size, className, ...props }) => {
  return (
    <BaseButton
      size={viewToSize[view] || size}
      className={classnames(styles.button, styles[`button-${view}`], className)}
      {...props}
    />
  );
};

export default Button;
