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
import { Container, Item } from "../SquareGrid/SquareGrid";
import styles from "./ProgramMode.module.css";

const { SELECT_PROGRAM } = PAGES;
const { COMMON } = TRANSLATION_ROOT_KEYS;
const {
  remainingTime: remainingTime_T,
  resistance,
  currentRPM: currentRPM_T,
  targetRPM,
} = TRANSLATION_KEYS[COMMON];

const getTPath = (...args) => getTranslationPath(COMMON, ...args);

const getRemainingTime = endMills => {
  const remainingDate = new Date(endMills - Date.now());
  const minutes = remainingDate.getMinutes();
  const seconds = remainingDate.getSeconds();
  return `${zeroFill(2, minutes)}:${zeroFill(2, seconds)}`;
};

const minute = 60000;

const ProgramMode = props => {
  const intervalRef = useRef();
  const counterRef = useRef();
  const timerRef = useRef();
  const [timer, setTimer] = useState(undefined);
  const [counter, setCounter] = useState(undefined);
  const { t } = useTranslation();
  const location = useLocation();
  const programTitle = useMemo(
    () => location.pathname.slice(PAGES_PATHS[SELECT_PROGRAM].length + 1),
    [location],
  );
  const { data: currentRpm } = useGetCadenceQuery() || {};
  const { data: programArray } = useGetProgramQuery(programTitle) || {};

  const { resistanceLevel, targetRpm } = programArray?.[counter] || {};
  const isGoodRpm = currentRpm < targetRpm + 10 && currentRpm > targetRpm - 10;

  useEffect(() => {
    return () => {
      clearInterval(intervalRef.current);
      clearInterval(timerRef.current);
      intervalRef.current = undefined;
      counterRef.current = undefined;
      timerRef.current = undefined;
      setTimer(undefined);
      setCounter(undefined);
      stopMotor();
    };
  }, []);

  useEffect(() => {
    if (programArray && !intervalRef.current && !(counter >= 0)) {
      const endTime = Date.now() + programArray.length * minute;

      counterRef.current = 0;
      setCounter(0);

      setMotorLevel(programArray[counterRef.current].resistanceLevel);

      intervalRef.current = setInterval(() => {
        if (programArray[counterRef.current]) {
          counterRef.current += 1;
          setCounter(counterRef.current);

          setMotorLevel(programArray[counterRef.current].resistanceLevel);
        } else {
          clearInterval(intervalRef.current);
        }
      }, minute);

      setTimer(getRemainingTime(endTime));

      timerRef.current = setInterval(() => {
        if (programArray[counterRef.current]) {
          setTimer(getRemainingTime(endTime));
        } else {
          clearInterval(timerRef.current);
        }
      }, 1000);
    }
  }, [programArray, counter]);

  return (
    <>
      <Container>
        <Item>
          <h1> {`${t(getTPath(remainingTime_T))}: ${timer}`}</h1>
        </Item>
        <Item>
          <h1> {`${t(getTPath(resistance))}: ${resistanceLevel}`}</h1>
        </Item>
      </Container>

      <Container>
        <Item>
          <h1> {`${t(getTPath(targetRPM))}: ${targetRpm}`}</h1>
        </Item>
        <Item className={isGoodRpm ? styles.rpmGreen : styles.rpmRed}>
          <h1> {`${t(getTPath(currentRPM_T))}: ${round(currentRpm)}`}</h1>
        </Item>
      </Container>
    </>
  );
};

export default ProgramMode;
