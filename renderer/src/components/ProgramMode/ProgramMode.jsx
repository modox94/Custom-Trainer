import React, { useEffect, useMemo, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { setMotorLevel, stopMotor, useGetProgramQuery } from "../../api/ipc";
import { PAGES, PAGES_PATHS } from "../../constants/pathConst";
import BarChart from "../BarChart/BarChart";
import CadenceGauge from "../CadenceGauge/CadenceGauge";
import Clock from "../Clock/Clock";
import { Container, Item } from "../SquareGrid/SquareGrid";
import Timer from "../Timer/Timer";
import styles from "./ProgramMode.module.css";

const { SELECT_PROGRAM } = PAGES;

const minute = 60000;

const ProgramMode = props => {
  const intervalRef = useRef();
  const counterRef = useRef();
  const [counter, setCounter] = useState(undefined);
  const [endTime, setEndTime] = useState(undefined);
  const location = useLocation();
  const programTitle = useMemo(
    () => location.pathname.slice(PAGES_PATHS[SELECT_PROGRAM].length + 1),
    [location],
  );

  const { data: programArray } = useGetProgramQuery(programTitle) || {};
  const { targetRpm } = programArray?.[counter] || {};

  useEffect(() => {
    return () => {
      clearInterval(intervalRef.current);
      intervalRef.current = undefined;
      counterRef.current = undefined;
      setCounter(undefined);
      setEndTime(undefined);
      stopMotor();
    };
  }, []);

  useEffect(() => {
    if (programArray && !intervalRef.current && !(counter >= 0)) {
      const now = new Date();
      now.setMilliseconds(now.getMilliseconds() + programArray.length * minute);
      setEndTime(now);

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
    }
  }, [programArray, counter]);

  return (
    <>
      <Container>
        <Clock />
        <Item className={styles.paddingReduced}>
          <CadenceGauge targetRpm={targetRpm} />
        </Item>
        {endTime ? <Timer expiryTimestamp={endTime} /> : <Clock />}
      </Container>

      <Container>
        <BarChart programArray={programArray} currentStep={counter} />
      </Container>
    </>
  );
};

export default ProgramMode;
