import { notification } from "antd";

const transactionCallback = (message, cb) => (info) => {
  const { status, internalError } = info;

  if (internalError || status.isInvalid) {
    notification.error({
      message,
      description: `Extrinsic error: ${internalError}`,
    });
  }

  if (status.isInBlock) {
    notification.success({
      message,
      description: "Transaction is in block",
    });
  }

  if (status.isFinalized) {
    notification.success({
      message,
      description: "Block finalized",
    });
    cb && cb(info);
  }
};

export { transactionCallback };
