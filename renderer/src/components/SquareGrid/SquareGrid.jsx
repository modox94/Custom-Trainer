import { Card } from "@blueprintjs/core";
import clsx from "clsx";
import { noop } from "lodash";
import PropTypes from "prop-types";
import React from "react";
import styles from "./SquareGrid.module.css";

const Container = props => {
  const { className, fullHeight, children } = props;

  return (
    <div
      className={clsx(className, styles.container, {
        [styles.fullHeight]: fullHeight,
      })}
    >
      {children}
    </div>
  );
};

Container.propTypes = {
  className: PropTypes.string,
  fullHeight: PropTypes.bool,
  children: PropTypes.oneOfType([
    PropTypes.element,
    PropTypes.arrayOf(PropTypes.element),
  ]),
};
Container.defaultProps = {
  className: "",
  fullHeight: false,
};

const Item = props => {
  const { className, onClick, children, ...otherProps } = props;

  return (
    <Card
      className={clsx(className, styles.item)}
      interactive={Boolean(onClick)}
      onClick={onClick || noop}
      {...otherProps}
    >
      {children}
    </Card>
  );
};

Item.propTypes = {
  className: PropTypes.string,
  onClick: PropTypes.func,
  children: PropTypes.oneOfType([PropTypes.element, PropTypes.array]),
};
Item.defaultProps = {
  className: "",
};

export { Container, Item };
