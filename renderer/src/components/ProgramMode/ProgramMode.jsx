import { get } from "lodash";
import React, { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { useTimer } from "react-timer-hook";
import {
  preventDisplaySleep,
  setMotorLevel,
  stopMotor,
  useGetProgramQuery,
} from "../../api/ipc";
import { PAGES, PAGES_PATHS } from "../../constants/pathConst";
import { RUNNINIG_STATUS } from "../../constants/reduxConst";
import { getRunningStatus } from "../../selectors/environmentSelectors";
import BarChart from "../BarChart/BarChart";
import CadenceGauge from "../CadenceGauge/CadenceGauge";
import Clock from "../Clock/Clock";
import { Container, Item } from "../SquareGrid/SquareGrid";
import Timer from "../Timer/Timer";
import styles from "./ProgramMode.module.css";

const { RUN } = RUNNINIG_STATUS;
const { SELECT_PROGRAM } = PAGES;

// const minute = 3000;
const minute = 60000;

const ProgramMode = props => {
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
  const location = useLocation();
  const runningStatus = useSelector(getRunningStatus);

  const programTitle = useMemo(
    () => location.pathname.slice(PAGES_PATHS[SELECT_PROGRAM].length + 1),
    [location],
  );
  const { data: programArray } = useGetProgramQuery(programTitle) || {};
  const { targetRpm } = programArray?.[counter] || {};

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
    const programLength = get(programArray, ["length"], 0);

    if (counter === undefined && programLength > 0) {
      const stepEndTime = new Date();
      stepEndTime.setMilliseconds(stepEndTime.getMilliseconds() + minute);
      const newTotalEndTime = new Date();
      newTotalEndTime.setMilliseconds(
        newTotalEndTime.getMilliseconds() + programLength * minute,
      );
      restart(stepEndTime);
      setMotorLevel(programArray[0].resistanceLevel);
      setCounter(0);
      setTotalEndTime(newTotalEndTime);
    }
  }, [programArray, counter, restart]);

  useEffect(() => {
    const programLength = get(programArray, ["length"], 0);
    if (isDone || programLength === 0) {
      return;
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
      setMotorLevel(programArray[newCounter].resistanceLevel);
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
    minutes,
    programArray,
    restart,
    runningStatus,
    seconds,
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

  return (
    <>
      <Container>
        <Clock />
        {/* <Item>
          {isDone ? `${counter}_DONE` : `${counter}__${minutes}:${seconds}`}
        </Item> */}
        <Item className={styles.paddingReduced}>
          <CadenceGauge targetRpm={targetRpm} />
        </Item>
        {totalEndTime ? <Timer expiryTimestamp={totalEndTime} /> : <Clock />}
      </Container>

      <Container>
        <BarChart programArray={programArray} currentStep={counter} />
      </Container>
    </>
  );
};

export default ProgramMode;
