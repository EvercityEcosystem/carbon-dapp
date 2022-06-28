import React from "react";
import { Typography } from "antd";
import classnames from "classnames";
import styles from "./Link.module.less";

const ExternalLink = ({ className, view = "default", ...props }) => {
  return (
    <Typography.Link
      target="__blank"
      className={classnames(styles.link, styles[`link-${view}`], className)}
      {...props}
    />
  );
};

export default ExternalLink;
