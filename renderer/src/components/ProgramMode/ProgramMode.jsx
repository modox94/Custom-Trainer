import { round } from "lodash";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";
import zeroFill from "zero-fill";
import {
  setMotorLevel,
  stopMotor,
  useGetCadenceQuery,
  useGetProgramQuery,
} from "../../api/ipc";
import { PAGES, PAGES_PATHS } from "../../constants/pathConst";
import {
  TRANSLATION_KEYS,
  TRANSLATION_ROOT_KEYS,
} from "../../constants/translationConst";
import { getTranslationPath } from "../../utils/translationUtils";
import SquareGrid from "../SquareGrid/SquareGrid";
import styles from "./ProgramMode.module.css";

const { SELECT_PROGRAM } = PAGES;
const { COMMON } = TRANSLATION_ROOT_KEYS;
const {
  remainingTime,
  resistance,
  currentRPM: currentRPM_T,
  targetRPM,
} = TRANSLATION_KEYS[COMMON];

const getTPath = (...args) => getTranslationPath(COMMON, ...args);

const minute = 60000;

const ProgramMode = props => {
  const interval = useRef();
  const counterRef = useRef();
  const timerRef = useRef();
  const [timer, setTimer] = useState();
  const [counter, setCounter] = useState();
  const { t } = useTranslation();
  const location = useLocation();
  const programTitle = useMemo(
    () => location.pathname.slice(PAGES_PATHS[SELECT_PROGRAM].length + 1),
    [location],
  );
  const { data: currentRpm } = useGetCadenceQuery() || {};
  const { data: programArray } = useGetProgramQuery(programTitle) || {};

  useEffect(() => {
    return () => {
      clearInterval(interval.current);
      clearInterval(timerRef.current);
      stopMotor();
    };
  }, []);

  useEffect(() => {
    if (programArray && !interval.current && !(counter >= 0)) {
      const endTime = Date.now() + programArray.length * minute;

      counterRef.current = 0;
      setCounter(0);

      setMotorLevel(programArray[counterRef.current].resistanceLevel);

      interval.current = setInterval(() => {
        if (programArray[counterRef.current]) {
          counterRef.current += 1;
          setCounter(counterRef.current);

          setMotorLevel(programArray[counterRef.current].resistanceLevel);
        } else {
          clearInterval(interval.current);
        }
      }, minute);

      timerRef.current = setInterval(() => {
        if (programArray[counterRef.current]) {
          const remainingDate = new Date(endTime - Date.now());

          const newTimer = `${zeroFill(
            2,
            remainingDate.getMinutes(),
          )}:${zeroFill(2, remainingDate.getSeconds())}`;

          setTimer(newTimer);
        } else {
          clearInterval(timerRef.current);
        }
      }, 1000);
    }
  }, [programArray, counter]);

  const items = useMemo(() => {
    const { resistanceLevel, targetRpm } = programArray?.[counter] || {};

    return [
      {
        title: `${t(getTPath(remainingTime))}: ${timer}`,
      },
      {
        title: `${t(getTPath(resistance))}: ${resistanceLevel}`,
      },
      {
        title: `${t(getTPath(targetRPM))}: ${targetRpm}`,
      },
      {
        className:
          currentRpm > targetRpm + 10 || currentRpm < targetRpm - 10
            ? styles.rpmRed
            : styles.rpmGreen,
        title: `${t(getTPath(currentRPM_T))}: ${round(currentRpm)}`,
      },
    ];
  }, [programArray, counter, t, timer, currentRpm]);

  return <SquareGrid columns={2} items={items} />;
};

export default ProgramMode;
