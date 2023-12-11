import { get, isPlainObject } from "lodash";
import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useGetCadenceQuery } from "../api/ipc";
import { RUNNINIG_STATUS } from "../constants/reduxConst";
import {
  getRunningStatus,
  updateRunningStatus,
} from "../slices/environmentSlice";

const { PAUSE } = RUNNINIG_STATUS;

export const consoleError = (error, dataObject = {}) => {
  console.error(error);

  if (isPlainObject(dataObject)) {
    for (const dataKey in dataObject) {
      console.log(dataKey, dataObject[dataKey]);
    }
  }
};

export const sleep = (delay = 1000) =>
  new Promise(resolve => {
    setTimeout(resolve, delay);
  });

export const isProduction = process.env.NODE_ENV === "production";

// source: https://usehooks.com/usePrevious/
export const usePrevious = value => {
  // The ref object is a generic container whose current property is mutable ...
  // ... and can hold any value, similar to an instance property on a class
  const ref = useRef();
  // Store current value in ref
  useEffect(() => {
    ref.current = value;
  }, [value]); // Only re-run if value changes
  // Return previous value (happens before update in useEffect above)
  return ref.current;
};

export const useCadenceState = () => {
  const dispatch = useDispatch();
  const runningStatus = useSelector(getRunningStatus);
  const cadenceObject = useGetCadenceQuery();
  const currentCadence = get(cadenceObject, ["data", "result"], 0);
  const lastTimecode = get(cadenceObject, ["data", "lastTimecode"]);

  useEffect(() => {
    dispatch(updateRunningStatus(lastTimecode));
  }, [dispatch, lastTimecode]);

  return [
    runningStatus === PAUSE ? 0 : currentCadence,
    lastTimecode,
    runningStatus,
  ];
};
