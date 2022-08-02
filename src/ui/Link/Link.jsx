import React from "react";
import { Link as BaseLink } from "react-router-dom";
import classnames from "classnames";
import styles from "./Link.module.less";

const Link = ({ view, disable, className, ...props }) => {
  return (
    <BaseLink
      className={classnames(
        styles.link,
        styles[`link-${view}`],
        { [styles["link--disable"]]: disable },
        className,
      )}
      {...props}
    />
  );
};

export default Link;
