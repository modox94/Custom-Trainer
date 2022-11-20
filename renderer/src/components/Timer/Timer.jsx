import PropTypes from "prop-types";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useStopwatch, useTimer } from "react-timer-hook";
import zeroFill from "zero-fill";
import {
  TRANSLATION_KEYS,
  TRANSLATION_ROOT_KEYS,
} from "../../constants/translationConst";
import { getTranslationPath } from "../../utils/translationUtils";
import { Item } from "../SquareGrid/SquareGrid";
import styles from "./Timer.module.css";

const { COMMON } = TRANSLATION_ROOT_KEYS;
const {
  remaining: remaining_T,
  elapsed: elapsed_T,
  time: time_T,
} = TRANSLATION_KEYS[COMMON];

const getTPath = (...args) => getTranslationPath(COMMON, ...args);

const TIMER_TYPES = { REMAIN: "REMAIN", ELAPSE: "ELAPSE" };

const Timer = props => {
  const { expiryTimestamp } = props;

  const [type, setType] = useState(TIMER_TYPES.REMAIN);
  const { t } = useTranslation();
  const { seconds: seconds_E, minutes: minutes_E } = useStopwatch({
    autoStart: true,
  });
  const { seconds: seconds_R, minutes: minutes_R } = useTimer({
    expiryTimestamp,
  });

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
