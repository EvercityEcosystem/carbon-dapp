import React from "react";
import { Button } from "antd";

const RequestInstall = () => {
  return (
    <>
      <Button
        onClick={() => window.location.reload()}
        type="primary"
        block
        size="large">
        Reload Page to Apply the Extension
      </Button>
      <a target="_blank" style={{ width: "100%" }} rel="noreferrer">
        <Button type="default" block size="large">
          Install Extension
        </Button>
      </a>
    </>
  );
};

export default RequestInstall;
