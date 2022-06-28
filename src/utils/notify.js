import { notification } from "antd";

const transactionCallback = (message, cb) => info => {
  const { status } = info;
  if (status.isInBlock) {
    notification.success({
      message,
      description: "Transaction is in block",
    });
  }

  if (status.isFinalized) {
    const { Finalized } = status.toJSON();
    console.info(message, Finalized);

    notification.success({
      message,
      description: "Block finalized",
    });
    cb && cb(info);
  }
};

export { transactionCallback };
