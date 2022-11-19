import { Container, Item } from "../SquareGrid/SquareGrid";
import clsx from "clsx";
import React, { useEffect, useMemo, useRef, useState } from "react";
import styles from "./BarChart.module.css";
import PropTypes from "prop-types";
import { noop, isNumber } from "lodash";

const BarChart = props => {
  const { currentStep, programArray } = props;
  const ref = useRef();

  const barsArray = useMemo(
    () =>
      programArray.map((programStep, idx) => {
        const { resistanceLevel, targetRpm } = programStep;

        return {
          key: `${idx}_${resistanceLevel}_${targetRpm}`,
          style: { height: `${resistanceLevel * 10}%` },
        };
      }),
    [programArray],
  );

  useEffect(() => {
    const element = ref.current;

    if (element) {
      const onWheel = event => {
        const { shiftKey, deltaY, wheelDelta } = event || {};

        if (!shiftKey && isNumber(deltaY) && isNumber(wheelDelta)) {
          event.preventDefault();
          const factor = deltaY >= 0 ? 1 : -1;
          element.scrollTo({
            left: element.scrollLeft + Math.abs(wheelDelta) * factor,
            behavior: "smooth",
          });
        }
      };

      element.addEventListener("wheel", onWheel);

      return () => element.removeEventListener("wheel", onWheel);
    }
  }, []);

  useEffect(() => {
    const element = ref.current;

    const targetEl = element?.children?.[currentStep + 1];

    console.log("targetEl", targetEl);
    // offsetLeft

    // parent
    // offsetLeft
    // offsetWidth
  }, [currentStep]);

  return (
    <Item className={styles.container}>
      <div ref={ref} className={styles.barContainer}>
        <div className={styles.spacerBar} />
        {barsArray.map((bar, idx) => {
          const { key, style } = bar;
          return (
            <div
              key={key}
              className={clsx(styles.bar, {
                [styles.barActive]: currentStep === idx,
              })}
              style={style}
            />
          );
        })}
        <div className={styles.spacerBar} />
      </div>
    </Item>
  );
};

BarChart.propTypes = {
  programArray: PropTypes.array,
  currentStep: PropTypes.number,
};
BarChart.defaultProps = {
  programArray: [],
};

export default BarChart;
