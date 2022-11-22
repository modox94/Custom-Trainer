import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { useStopwatch, useTimer } from "react-timer-hook";
import zeroFill from "zero-fill";
import { RUNNINIG_STATUS } from "../../constants/reduxConst";
import {
  TRANSLATION_KEYS,
  TRANSLATION_ROOT_KEYS,
} from "../../constants/translationConst";
import { getRunningStatus } from "../../selectors/environmentSelectors";
import { getTranslationPath } from "../../utils/translationUtils";
import { Item } from "../SquareGrid/SquareGrid";
import styles from "./Timer.module.css";

const { COMMON } = TRANSLATION_ROOT_KEYS;
const {
  remaining: remaining_T,
  elapsed: elapsed_T,
  time: time_T,
} = TRANSLATION_KEYS[COMMON];
const { RUN } = RUNNINIG_STATUS;

const getTPath = (...args) => getTranslationPath(COMMON, ...args);

const TIMER_TYPES = { REMAIN: "REMAIN", ELAPSE: "ELAPSE" };

const Timer = props => {
  const { expiryTimestamp } = props;
  const runningStatus = useSelector(getRunningStatus);
  const [type, setType] = useState(TIMER_TYPES.REMAIN);
  const { t } = useTranslation();
  const {
    seconds: seconds_E,
    minutes: minutes_E,
    isRunning: isRunning_E,
    start: start_E,
    pause: pause_E,
  } = useStopwatch({
    autoStart: true,
  });
  const {
    seconds: seconds_R,
    minutes: minutes_R,
    hours: hours_R,
    days: days_R,
    isRunning: isRunning_R,
    pause: pause_R,
    resume: resume_R,
  } = useTimer({
    expiryTimestamp,
  });

  useEffect(() => {
    const isExpired =
      seconds_R === 0 && minutes_R === 0 && hours_R === 0 && days_R === 0;
    const isRunningStatus = runningStatus === RUN;

    if (!isExpired && isRunning_R && !isRunningStatus) {
      pause_R();
    }
    if (!isExpired && !isRunning_R && isRunningStatus) {
      resume_R();
    }

    if (isRunning_E && !isRunningStatus) {
      pause_E();
    }
    if (!isRunning_E && isRunningStatus) {
      start_E();
    }
  }, [
    days_R,
    hours_R,
    isRunning_E,
    isRunning_R,
    minutes_R,
    pause_E,
    pause_R,
    resume_R,
    runningStatus,
    seconds_R,
    start_E,
  ]);

  const onClick = () => {
    switch (type) {
      case TIMER_TYPES.REMAIN:
        setType(TIMER_TYPES.ELAPSE);
        break;

      case TIMER_TYPES.ELAPSE:
        setType(TIMER_TYPES.REMAIN);
        break;

      default:
        break;
    }
  };

  return (
    <Item className={styles.timer} onClick={onClick}>
      <p>
        {t(getTPath(type === TIMER_TYPES.REMAIN ? remaining_T : elapsed_T))}
      </p>
      <p>{t(getTPath(time_T))}</p>
      <p>
        <b>
          {type === TIMER_TYPES.REMAIN
            ? `${zeroFill(2, minutes_R)}:${zeroFill(2, seconds_R)}`
            : `${zeroFill(2, minutes_E)}:${zeroFill(2, seconds_E)}`}
        </b>
      </p>
    </Item>
  );
};

Timer.propTypes = { expiryTimestamp: PropTypes.instanceOf(Date) };

export default Timer;
