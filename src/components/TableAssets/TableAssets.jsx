import React, { useMemo } from "react";
import { Table } from "antd";
import ExternalLink from "../../ui/Link/ExternalLink";
import Button from "../../ui/Button/Button";
import styles from "./TableAssets.module.less";
import Actions from "../../ui/Actions/Actions";
import classnames from "classnames";
import Link from "../../ui/Link/Link";

const TableAssets = ({
  assets,
  onMint,
  onBurn,
  isCustodian,
  className,
  onTransfer,
}) => {
  const columns = [
    {
      title: "ID",
      dataIndex: "id",
    },
    {
      title: "Supply",
      dataIndex: "supply",
    },
    {
      title: "Balance",
      dataIndex: "balance",
    },
    {
      title: "Certificates",
      dataIndex: "certificates",
    },
    {
      title: "Actions",
      dataIndex: "url",
      width: 300,
      render: (url, asset) => (
        <Actions>
          <ExternalLink view="action" href={url}>
            View
          </ExternalLink>
          <Link view="action" to={`${asset.id}`}>
            Meta
          </Link>
          {isCustodian && (
            <Button view="action" onClick={() => onMint(asset.id)}>
              Mint
            </Button>
          )}
          <Button
            view="action"
            onClick={() => onBurn(asset.id, asset.list_accounts)}
            disabled={Number(asset.supply) === 0}>
            Burn
          </Button>
          <Button
            view="action"
            onClick={() => onTransfer(asset.id)}
            disabled={Number(asset.balance) === 0}>
            Transfer
          </Button>
        </Actions>
      ),
    },
  ];

  const sortedAssets = useMemo(
    () => assets.sort((a, b) => Number(a.id) - Number(b.id)),
    [assets],
  );
  return (
    <Table
      size="small"
      className={classnames(styles.table, className)}
      dataSource={sortedAssets}
      columns={columns}
    />
  );
};

export default TableAssets;
