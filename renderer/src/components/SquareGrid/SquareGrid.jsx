import { Card } from "@blueprintjs/core";
import clsx from "clsx";
import { chunk, noop } from "lodash";
import PropTypes from "prop-types";
import React, { useMemo } from "react";
import styles from "./SquareGrid.module.css";

const SquareGrid = props => {
  const { items: itemsRaw, columns } = props;
  const items = useMemo(() => chunk(itemsRaw, columns), [itemsRaw, columns]);

  return items.map((container, idx) => {
    const key = container.reduce(
      (prevItem, item) => `${prevItem}_${item.title}`,
      "",
    );

    return (
      <div key={`container_${idx}_${key}`} className={styles.container}>
        {container.map((item, idx) => {
          const { onClick, title, className = "" } = item;

          return (
            <Card
              key={`item_${idx}_${title}`}
              className={clsx(className, styles.item)}
              interactive={Boolean(onClick)}
              onClick={onClick || noop}
            >
              <h1>{title}</h1>
            </Card>
          );
        })}
      </div>
    );
  });
};

SquareGrid.propTypes = {
  items: PropTypes.arrayOf(PropTypes.object),
  columns: PropTypes.number,
};

SquareGrid.defaultProps = {
  items: [],
  columns: 3,
};

export default SquareGrid;
