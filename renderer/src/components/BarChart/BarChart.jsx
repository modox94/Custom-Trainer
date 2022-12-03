import clsx from "clsx";
import { get, isNumber, round } from "lodash";
import PropTypes from "prop-types";
import React, { useEffect, useMemo, useRef } from "react";
import { MAX_RES_LEVEL } from "../../constants/TODOconst";
import { Item } from "../SquareGrid/SquareGrid";
import styles from "./BarChart.module.css";

const BarChart = props => {
  const { currentStep, steps, maxResistanceLevel, isDone } = props;
  const ref = useRef();

  const barsArray = useMemo(
    () =>
      steps.map((programStep, idx) => {
        const { resistanceLevel, targetRpm } = programStep;
        const height = `${round(
          (resistanceLevel / maxResistanceLevel) * MAX_RES_LEVEL * 10,
        )}%`;

        return {
          key: `${idx}_${resistanceLevel}_${targetRpm}`,
          style: { height },
        };
      }),
    [maxResistanceLevel, steps],
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
  steps: PropTypes.array,
  currentStep: PropTypes.number,
  isDone: PropTypes.bool,
};
BarChart.defaultProps = {
  steps: [],
  isDone: false,
};

export default BarChart;
