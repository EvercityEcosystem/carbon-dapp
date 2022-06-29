import React from "react";
import { Link as BaseLink } from "react-router-dom";
import classnames from "classnames";
import styles from "./Link.module.less";

const Link = ({ view, className, ...props }) => {
  return (
    <BaseLink
      className={classnames(styles.link, styles[`link-${view}`], className)}
      {...props}
    />
  );
};

export default Link;
