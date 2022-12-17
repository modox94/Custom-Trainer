import clsx from "clsx";
import { get, isNumber, noop, round, set, unset } from "lodash";
import PropTypes from "prop-types";
import React, { useEffect, useMemo, useRef } from "react";
import { MAX_RES_LEVEL, MAX_RPM_LEVEL } from "../../constants/settingsConst";
import { Item } from "../SquareGrid/SquareGrid";
import styles from "./BarChart.module.css";

const BarChart = props => {
  const {
    className,
    currentStep,
    steps,
    maxResistanceLevel,
    isDone,
    isEditor,
    setStep,
  } = props;
  const ref = useRef();

  const barsArray = useMemo(
    () =>
      steps.map((programStep, idx) => {
        const { resistanceLevel, targetRpm } = programStep;
        const heightResistance = `${round(
          (resistanceLevel / maxResistanceLevel) * MAX_RES_LEVEL * 10,
        )}%`;
        const heightRpm = `${round((targetRpm / MAX_RPM_LEVEL) * 100)}%`;

        const result = {
          key: `${idx}_${resistanceLevel}_${targetRpm}`,
          styleResistance: { height: heightResistance },
          styleRpm: { display: "none", height: heightRpm },
        };
        if (isEditor) {
          unset(result, ["styleRpm", "display"]);
          set(result, ["onClick"], () => setStep(idx));
        }

        return result;
      }),
    [isEditor, maxResistanceLevel, setStep, steps],
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
    <Item className={clsx(className, styles.container)}>
      <div ref={ref} className={styles.barContainer}>
        <div className={styles.spacerBar} />
        {barsArray.map((bar, idx) => {
          const { key, styleResistance, styleRpm, onClick } = bar;
          return (
            <div
              key={key}
              className={clsx(styles.bar, {
                [styles.barActive]: currentStep === idx && !isDone,
                [styles.barDone]: !isEditor && (idx < currentStep || isDone),
              })}
              onClick={onClick}
            >
              <div className={styles.barResistance} style={styleResistance} />
              <div className={styles.barRpm} style={styleRpm} />
            </div>
          );
        })}
        <div className={styles.spacerBar} />
      </div>
    </Item>
  );
};

BarChart.propTypes = {
  className: PropTypes.string,
  steps: PropTypes.array,
  currentStep: PropTypes.number,
  maxResistanceLevel: PropTypes.number,
  isDone: PropTypes.bool,
  isEditor: PropTypes.bool,
  setStep: PropTypes.func,
};
BarChart.defaultProps = {
  className: "",
  steps: [],
  currentStep: 0,
  maxResistanceLevel: MAX_RES_LEVEL,
  isDone: false,
  isEditor: false,
  setStep: noop,
};

export default BarChart;
