import { NAMES } from "../constants/reduxConst";

export const getRunningStatus = state => state[NAMES.environment].runningStatus;

export const getFooterStatus = state => state[NAMES.environment].footerStatus;

export const getCursorNoneTemp = state =>
  state[NAMES.environment].cursorNoneTemp;

export const getProgramTitle = state =>
  state[NAMES.environment].programTitle || "";

export const getProgramSteps = state => state[NAMES.environment].programSteps;
