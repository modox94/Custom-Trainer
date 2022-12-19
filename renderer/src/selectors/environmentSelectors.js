import { NAMES } from "../constants/reduxConst";

export const getRunningStatus = state => state[NAMES.environment].runningStatus;

export const getFooterStatus = state => state[NAMES.environment].footerStatus;
