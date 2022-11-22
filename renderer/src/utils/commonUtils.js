import { isPlainObject } from "lodash";

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
