import React from "react";
import { useTranslation } from "react-i18next";
import { useTime } from "react-timer-hook";
import {
  TRANSLATION_KEYS,
  TRANSLATION_ROOT_KEYS,
} from "../../constants/translationConst";
import { getTranslationPath } from "../../utils/translationUtils";
import { Item } from "../SquareGrid/SquareGrid";
import styles from "./Clock.module.css";
import zeroFill from "zero-fill";

const { WORKOUT_TRK } = TRANSLATION_ROOT_KEYS;
const { current_T, time_T } = TRANSLATION_KEYS[WORKOUT_TRK];

const getTPath = (...args) => getTranslationPath(WORKOUT_TRK, ...args);

const Clock = props => {
  const { t } = useTranslation();
  const { minutes, hours } = useTime({});

  return (
    <Item className={styles.clock}>
      <p>{t(getTPath(current_T))}</p>
      <p>{t(getTPath(time_T))}</p>
      <p>
        <b>{`${zeroFill(2, hours)}:${zeroFill(2, minutes)}`}</b>
      </p>
    </Item>
  );
};

Clock.propTypes = {};
Clock.defaultProps = {};

export default Clock;
