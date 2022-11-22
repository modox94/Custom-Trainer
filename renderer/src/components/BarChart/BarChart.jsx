import clsx from "clsx";
import { get, isNumber } from "lodash";
import PropTypes from "prop-types";
import React, { useEffect, useMemo, useRef } from "react";
import { Item } from "../SquareGrid/SquareGrid";
import styles from "./BarChart.module.css";

const BarChart = props => {
  const { currentStep, programArray, isDone } = props;
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

    if (get(element, ["children", "length"], 0) > 0) {
      const barElement = get(element, ["children", 1]);
      const styles = window.getComputedStyle(barElement);
      const barWidth =
        parseFloat(styles.marginLeft) +
        parseFloat(styles.width) +
        parseFloat(styles.marginRight);
      element.scrollTo({ left: barWidth * currentStep, behavior: "smooth" });
    }
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
                [styles.barActive]: currentStep === idx && !isDone,
                [styles.barDone]: idx < currentStep || isDone,
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
  isDone: PropTypes.bool,
};
BarChart.defaultProps = {
  programArray: [],
  isDone: false,
};

export default BarChart;
