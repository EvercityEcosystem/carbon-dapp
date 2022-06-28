import React from "react";

import { Spin } from "antd";
import classnames from "classnames";

import styles from "./Loader.module.less";

const Loader = ({ className, spinning = false, ...props }) => (
  <Spin
    wrapperClassName={classnames(styles.loader, className)}
    spinning={spinning}
    {...props}
  />
);

export default Loader;
