import { Button, Classes, Dialog } from "@blueprintjs/core";
import { IconNames } from "@blueprintjs/icons";
import { get, round } from "lodash";
import React, { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { useMatch, useNavigate } from "react-router-dom";
import { useTimer } from "react-timer-hook";
import {
  preventDisplaySleep,
  setMotorLevel,
  stopMotor,
  useGetProgramsQuery,
} from "../../api/ipc";
import { PAGES, PAGES_PATHS, SUB_PATHS } from "../../constants/pathConst";
import { RUNNINIG_STATUS } from "../../constants/reduxConst";
import { MAX_RES_LEVEL } from "../../constants/settingsConst";
import {
  TRANSLATION_KEYS,
  TRANSLATION_ROOT_KEYS,
} from "../../constants/translationConst";
import { getRunningStatus } from "../../selectors/environmentSelectors";
import { getTranslationPath } from "../../utils/translationUtils";
import BarChart from "../BarChart/BarChart";
import CadenceGauge from "../CadenceGauge/CadenceGauge";
import Clock from "../Clock/Clock";
import { Container, Item } from "../SquareGrid/SquareGrid";
import Timer from "../Timer/Timer";
import styles from "./ProgramMode.module.css";

const { COMMON, WORKOUT } = TRANSLATION_ROOT_KEYS;
const { back, repeat } = TRANSLATION_KEYS[COMMON];
const { trainingDone, trainingDoneMsg } = TRANSLATION_KEYS[WORKOUT];
const { RUN } = RUNNINIG_STATUS;
const { SELECT_PROGRAM } = PAGES;

const getTPath = (...args) => getTranslationPath(COMMON, ...args);

// const minute = 500;
// const minute = 3000;
const minute = 60000;

const ProgramMode = props => {
  const { t } = useTranslation();
  const {
    seconds,
    minutes,
    hours,
    days,
    isRunning: isRunningTimer,
    pause,
    resume,
    restart,
  } = useTimer({
    expiryTimestamp: new Date(),
    autoStart: false,
  });
  const [counter, setCounter] = useState(undefined);
  const [isDone, setIsDone] = useState(false);
  const [totalEndTime, setTotalEndTime] = useState(undefined);
  const navigate = useNavigate();
  const runningStatus = useSelector(getRunningStatus);

  const filenameMatch = useMatch(
    `${PAGES_PATHS[SELECT_PROGRAM]}/:${SUB_PATHS.FILENAME}`,
  );

  const fileName = useMemo(
    () => get(filenameMatch, ["params", SUB_PATHS.FILENAME], ""),
    [filenameMatch],
  );
  const { data: programs = {} } =
    useGetProgramsQuery(undefined, {
      refetchOnMountOrArgChange: true,
    }) || {};

  const targetRpm = get(programs, [fileName, "steps", counter, "targetRpm"], 0);
  const steps = get(programs, [fileName, "steps"], []);
  const maxResistanceLevel = get(programs, [fileName, "maxResistanceLevel"], 0);

  useEffect(() => {
    preventDisplaySleep(true);

    return () => {
      setCounter(undefined);
      setIsDone(false);
      setTotalEndTime(undefined);
      stopMotor();
      preventDisplaySleep(false);
    };
  }, []);

  useEffect(() => {
    const programLength = get(steps, ["length"], 0);
    if (isDone || programLength === 0) {
      return;
    }

    if (counter === undefined) {
      const stepEndTime = new Date();
      stepEndTime.setMilliseconds(stepEndTime.getMilliseconds() + minute);
      const newTotalEndTime = new Date();
      newTotalEndTime.setMilliseconds(
        newTotalEndTime.getMilliseconds() + programLength * minute,
      );
      restart(stepEndTime);
      setMotorLevel(
        round((steps[0].resistanceLevel / maxResistanceLevel) * MAX_RES_LEVEL),
      );
      setCounter(0);
      setTotalEndTime(newTotalEndTime);
    }

    const isExpired =
      days === 0 && seconds === 0 && minutes === 0 && hours === 0;
    const isRunningStatus = runningStatus === RUN;

    if (counter === programLength - 1 && isExpired) {
      setIsDone(true);
      return;
    }

    if (
      isExpired &&
      isRunningStatus &&
      counter >= 0 &&
      counter < programLength - 1
    ) {
      const newCounter = counter + 1;
      setMotorLevel(
        round(
          (steps[newCounter].resistanceLevel / maxResistanceLevel) *
            MAX_RES_LEVEL,
        ),
      );
      const stepEndTime = new Date();
      stepEndTime.setMilliseconds(stepEndTime.getMilliseconds() + minute);
      restart(stepEndTime);
      setCounter(counter + 1);
    }
  }, [
    counter,
    days,
    hours,
    isDone,
    maxResistanceLevel,
    minutes,
    restart,
    runningStatus,
    seconds,
    steps,
  ]);

  useEffect(() => {
    const isExpired =
      days === 0 && seconds === 0 && minutes === 0 && hours === 0;
    const isRunningStatus = runningStatus === RUN;

    if (!isExpired && isRunningTimer && !isRunningStatus) {
      pause();
    }

    if (!isExpired && !isRunningTimer && isRunningStatus) {
      resume();
    }
  }, [
    days,
    hours,
    isRunningTimer,
    minutes,
    pause,
    resume,
    runningStatus,
    seconds,
  ]);

  const goBack = () => {
    navigate(-1);
  };

  const repeatProgram = () => {
    setCounter(undefined);
    setIsDone(false);
    setTotalEndTime(undefined);
    stopMotor();
    preventDisplaySleep(false);
  };

  return (
    <>
      <Dialog
        isOpen={isDone}
        title={t(getTranslationPath(WORKOUT, trainingDone))}
        canOutsideClickClose={false}
        isCloseButtonShown={false}
      >
        <div className={Classes.DIALOG_BODY}>
          <p className={Classes.TEXT_LARGE}>
            {t(getTranslationPath(WORKOUT, trainingDoneMsg))}
          </p>
        </div>
        <div className={Classes.DIALOG_FOOTER}>
          <div className={Classes.DIALOG_FOOTER_ACTIONS}>
            <Button
              large
              icon={IconNames.REPEAT}
              text={t(getTPath(repeat))}
              onClick={repeatProgram}
            />
            <Button
              large
              icon={IconNames.ARROW_LEFT}
              text={t(getTPath(back))}
              onClick={goBack}
            />
          </div>
        </div>
      </Dialog>
      <Container>
        <Clock />
        <Item className={styles.paddingReduced}>
          <CadenceGauge targetRpm={targetRpm} />
        </Item>
        {totalEndTime ? <Timer expiryTimestamp={totalEndTime} /> : <Clock />}
      </Container>

      <Container>
        <BarChart
          steps={steps}
          maxResistanceLevel={maxResistanceLevel}
          currentStep={counter}
          isDone={isDone}
        />
      </Container>
    </>
  );
};

export default ProgramMode;
