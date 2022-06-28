import React from "react";
import styles from "./Container.module.less";
import classnames from "classnames";

const Container = ({ children, align = "center", justify = "center" }) => {
  return (
    <div
      className={classnames(
        styles.container,
        styles[`align--${align}`],
        styles[`justify--${justify}`],
      )}>
      {children}
    </div>
  );
};

export default Container;
