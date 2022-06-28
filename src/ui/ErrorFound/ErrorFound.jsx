import React from "react";

import { Result } from "antd";

const ErrorFound = ({ status }) => {
  if (status === 500) {
    return (
      <Result status="500" title="500" subTitle="Sorry, something went wrong" />
    );
  }

  if (status === 403) {
    return <Result status="403" title="403" subTitle="You have no access" />;
  }

  return (
    <Result
      status="404"
      title="404"
      subTitle="Sorry, the page you visited does not exist"
    />
  );
};

export default ErrorFound;
