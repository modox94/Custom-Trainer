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
import { usePrevious } from "../../utils/commonUtils";
import { getTranslationPath } from "../../utils/translationUtils";
import { Item } from "../SquareGrid/SquareGrid";
import styles from "./Timer.module.css";

const { WORKOUT_TRK } = TRANSLATION_ROOT_KEYS;
const { remainingTKey, elapsedTKey, timeTKey } = TRANSLATION_KEYS[WORKOUT_TRK];
const { RUN } = RUNNINIG_STATUS;

const getTPath = (...args) => getTranslationPath(WORKOUT_TRK, ...args);

export const TIMER_TYPES = { REMAIN: "REMAIN", ELAPSE: "ELAPSE" };

const Timer = props => {
  const { type: propsType, disabled, expiryTimestamp } = props;
  const runningStatus = useSelector(getRunningStatus);
  const [type, setType] = useState(propsType);
  const { t } = useTranslation();
  const prevExpiryTimestamp = usePrevious(expiryTimestamp);
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
    restart: restart_R,
  } = useTimer({
    expiryTimestamp,
  });

  useEffect(() => {
    if (
      expiryTimestamp !== prevExpiryTimestamp &&
      new Date() < expiryTimestamp
    ) {
      restart_R(expiryTimestamp);
    }
  }, [expiryTimestamp, prevExpiryTimestamp, restart_R]);

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
    if (disabled) {
      return;
    }

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
    <Item className={styles.timer} onClick={disabled ? undefined : onClick}>
      <p>
        {t(getTPath(type === TIMER_TYPES.REMAIN ? remainingTKey : elapsedTKey))}
      </p>
      <p>{t(getTPath(timeTKey))}</p>
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

Timer.propTypes = {
  type: PropTypes.oneOf(Object.values(TIMER_TYPES)),
  disabled: PropTypes.bool,
  expiryTimestamp: PropTypes.instanceOf(Date),
};

Timer.defaultProps = {
  type: TIMER_TYPES.REMAIN,
  disabled: false,
  expiryTimestamp: new Date(),
};

export default Timer;
