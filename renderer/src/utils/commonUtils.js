import { isPlainObject } from "lodash";
import { useEffect, useRef } from "react";

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
