import React from "react";
import styles from "./Actions.module.less";
import classnames from "classnames";

const Actions = ({ children, className }) => {
  return (
    <div className={classnames(styles.container, className)}>{children}</div>
  );
};

export default Actions;
