import { isPlainObject } from "lodash";

export const consoleError = (error, dataObject = {}) => {
  console.error(error);

  if (isPlainObject(dataObject)) {
    for (const dataKey in dataObject) {
      console.log(dataKey, dataObject[dataKey]);
    }
  }
};
