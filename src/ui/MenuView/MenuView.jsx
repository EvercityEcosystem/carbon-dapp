import React from "react";
import { Link } from "react-router-dom";
import { Badge, Menu } from "antd";
import styles from "./MenuView.module.less";
import { get, getOr } from "unchanged";

const pickKeys = (keysArr, curState, arrNotation = false) =>
  keysArr.reduce(
    (acc, cur) => ({
      ...acc,
      [cur]: get((arrNotation && [cur]) || cur, curState),
    }),
    {},
  );

const MenuView = props => {
  const { nodes } = props;

  const getLink = node => {
    const linkProps = {
      to: node.path,
      onClick: node.onClick && (() => node.onClick(node)),
    };

    return (
      <Link className={styles.link} {...linkProps}>
        {node.title}
      </Link>
    );
  };

  const renderNode = node => {
    const children = getOr([], "children", node);

    if (children.length) {
      return (
        <Menu.SubMenu
          key={node.key || node.title}
          title={node.title}
          disabled={node.disabled}>
          {children.map(renderNode)}
        </Menu.SubMenu>
      );
    }

    return (
      <Menu.Item
        key={node.key || node.title}
        icon={node.icon}
        disabled={node.disabled}>
        {node.badgeCount ? (
          <Badge count={node.badgeCount} offset={[8, 0]} size="small">
            {getLink(node)}
          </Badge>
        ) : (
          getLink(node)
        )}
      </Menu.Item>
    );
  };

  const activeNodes = nodes
    .filter(n => n.active === true)
    .map(n => n.key || n.title);

  return (
    <Menu
      {...pickKeys(
        ["className", "style", "mode", "selectable", "onClick", "theme"],
        props,
      )}
      selectedKeys={activeNodes}>
      {nodes.map(renderNode)}
    </Menu>
  );
};

export default MenuView;
