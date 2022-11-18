import { Card } from "@blueprintjs/core";
import clsx from "clsx";
import { noop } from "lodash";
import PropTypes from "prop-types";
import React from "react";
import styles from "./SquareGrid.module.css";

const Container = props => {
  const { className, children } = props;

  return <div className={clsx(className, styles.container)}>{children}</div>;
};

Container.propTypes = {
  className: PropTypes.string,
  children: PropTypes.oneOfType([
    PropTypes.element,
    PropTypes.arrayOf(PropTypes.element),
  ]),
};
Container.defaultProps = {
  className: "",
};

const Item = props => {
  const { className, onClick, children } = props;

  return (
    <Card
      className={clsx(className, styles.item)}
      interactive={Boolean(onClick)}
      onClick={onClick || noop}
    >
      {children}
    </Card>
  );
};

Item.propTypes = {
  className: PropTypes.string,
  onClick: PropTypes.func,
  children: PropTypes.oneOfType([
    PropTypes.element,
    PropTypes.arrayOf(PropTypes.element),
  ]),
};
Item.defaultProps = {
  className: "",
};

export { Container, Item };
