import React, { useMemo } from "react";
import { Table, message } from "antd";
import { CopyOutlined } from "@ant-design/icons";

import ExternalLink from "../../ui/Link/ExternalLink";
import Button from "../../ui/Button/Button";
import styles from "./TableAssets.module.less";
import Actions from "../../ui/Actions/Actions";
import classnames from "classnames";
import Link from "../../ui/Link/Link";
import { parseUnits } from "../../utils/converters";
import { getCurrentUser } from "../../utils/storage";

const TableAssets = ({
  assets,
  onMint,
  onBurn,
  isCustodian,
  className,
  loading,
  onTransfer,
}) => {
  const columns = useMemo(() => {
    const defaultColumns = [
      {
        key: "symbol",
        title: "Name",
        dataIndex: "metadata",
        className: styles.cell,
        render: (metadata) => metadata.name,
      },
      {
        key: "balance",
        title: "Balance",
        dataIndex: "balance",
        render: (balance) => parseUnits(balance),
      },
      {
        key: "retired",
        title: "Retired",
        dataIndex: "certificates",
        render: (certificates) => parseUnits(certificates),
      },
      {
        key: "actions",
        title: "Actions",
        dataIndex: "metadata",
        width: 300,
        render: (metadata, asset) => {
          const { address } = getCurrentUser();
          const hasAssetMetaPermissions =
            asset.owner === address || isCustodian;
          const isAssetMetaURLExists = !!metadata.url;
          const isMetaActionEnabled =
            !isAssetMetaURLExists && hasAssetMetaPermissions;

          return (
            <Actions>
              {isCustodian && (
                <Button
                  view="action"
                  onClick={() => onMint(asset.id, asset.metadata.symbol)}
                >
                  Mint
                </Button>
              )}
              <Button
                view="action"
                onClick={() =>
                  onBurn(asset.id, asset.list_accounts, asset.metadata.symbol)
                }
                disabled={parseUnits(asset.supply) === 0}
              >
                Retire
              </Button>
              <Button
                view="action"
                onClick={() => onTransfer(asset.id)}
                disabled={parseUnits(asset.balance) === 0}
              >
                Transfer
              </Button>
              {isMetaActionEnabled && (
                <Link view="action" to={`${asset.id}`}>
                  Meta
                </Link>
              )}
              {isAssetMetaURLExists && (
                <ExternalLink view="action" href={metadata.url}>
                  View
                </ExternalLink>
              )}
            </Actions>
          );
        },
      },
    ];

    if (isCustodian) {
      defaultColumns.splice(1, 0, {
        title: "Total Supply",
        dataIndex: "supply",
        render: (supply) => parseUnits(supply),
      });
    }

    return defaultColumns;
  }, [isCustodian]);

  const sortedAssets = useMemo(
    () => assets?.sort((a, b) => Number(a.id) - Number(b.id)),
    [assets],
  );
  return (
    <Table
      loading={loading}
      size="small"
      className={classnames(styles.table, className)}
      dataSource={sortedAssets}
      columns={columns}
      rowKey="id"
      expandable={{
        expandedRowRender: (record) => (
          <>
            <div style={{ margin: 10 }}>
              <span style={{ margin: 6 }}>
                Blockchain Asset ID: {record.id}
              </span>
              <CopyOutlined
                className={styles.copyIcon}
                onClick={() => {
                  navigator.clipboard.writeText(record.id);
                  message.success("ID copied!");
                }}
              />
            </div>
            <div style={{ margin: 10 }}>
              <span style={{ margin: 6 }}>
                Ticker: {record.metadata.symbol}
              </span>
              <CopyOutlined
                className={styles.copyIcon}
                onClick={() => {
                  navigator.clipboard.writeText(record.metadata.symbol);
                  message.success("Symbol copied!");
                }}
              />
            </div>
          </>
        ),
      }}
    />
  );
};

export default TableAssets;
