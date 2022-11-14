import { round } from "lodash";
import React, { useEffect, useRef, useState } from "react";
import zeroFill from "zero-fill";
import { useGetCadenceQuery } from "../../api/ipc";
import classes from "./SelectProgram.module.css";

const EVENTS = {
  CADENCE: "CADENCE",
  GET_PROGRAMS_LIST: "GET_PROGRAMS_LIST",
  GET_PROGRAM: "GET_PROGRAM",
  MOTOR_SET_LEVEL: "MOTOR_SET_LEVEL",
};

const minute = 60000;

const SelectProgram = props => {
  const [programs, setPrograms] = useState();
  const [curProgram, setCurProgram] = useState();
  const [programArray, setProgramArray] = useState();
  const interval = useRef();
  const counterRef = useRef();
  const timerRef = useRef();
  const [timer, setTimer] = useState();
  const [counter, setCounter] = useState();

  const { data } = useGetCadenceQuery() || {};

  useEffect(() => {
    const getProgramsList = async () => {
      const programsList = await window.electron.ipcRenderer.invoke(
        EVENTS.GET_PROGRAMS_LIST,
      );
      setPrograms(programsList);
    };

    getProgramsList();
  }, []);

  useEffect(() => {
    const getProgram = async () => {
      const result = await window.electron.ipcRenderer.invoke(
        EVENTS.GET_PROGRAM,
        curProgram,
      );

      setProgramArray(result);
    };

    if (curProgram) {
      getProgram();
    }
  }, [curProgram]);

  useEffect(() => {
    if (programArray && !interval.current && !(counter >= 0)) {
      const endTime = Date.now() + programArray.length * minute;

      counterRef.current = 0;
      setCounter(0);

      window.electron.ipcRenderer.send(
        EVENTS.MOTOR_SET_LEVEL,
        programArray[counterRef.current].resistanceLevel,
      );

      interval.current = setInterval(() => {
        if (programArray[counterRef.current]) {
          counterRef.current += 1;
          setCounter(counterRef.current + 1);
          window.electron.ipcRenderer.send(
            EVENTS.MOTOR_SET_LEVEL,
            programArray[counterRef.current].resistanceLevel,
          );
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

  if (programArray) {
    return (
      <>
        <div className={classes.container}>
          <div>
            <p className={classes.text}>Времени осталось: {timer}</p>
          </div>
          <div>
            <p className={classes.text}>
              Нагрузка:{" "}
              {counter >= 0
                ? programArray[counter]?.resistanceLevel || "---"
                : "---"}
            </p>
          </div>
        </div>

        <div className={classes.container}>
          <div>
            <p className={classes.text}>
              Требуемый RPM:{" "}
              {counter >= 0 ? programArray[counter]?.targetRpm || "---" : "---"}
            </p>
          </div>
          <div>
            <p className={classes.text}>
              Текущий RPM:{" "}
              <span
                className={
                  data > Number(programArray[counter]?.targetRpm) + 10 ||
                  data < Number(programArray[counter]?.targetRpm) - 10
                    ? classes.red
                    : classes.blue
                }
              >
                {data >= 0 ? round(data) : "---"}
              </span>
            </p>
          </div>
        </div>
      </>
    );
  }

  if (programs) {
    return (
      <div className={classes.buttons}>
        {programs.map(program => (
          <div key={program} className={classes.button}>
            <button
              className={classes.text}
              onClick={() => setCurProgram(program)}
            >
              {program}
            </button>
          </div>
        ))}
      </div>
    );
  }

  return <div>SelectProgram</div>;
};

export default SelectProgram;
