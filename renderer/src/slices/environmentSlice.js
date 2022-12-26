import { createSlice } from "@reduxjs/toolkit";
import { get, isNumber, noop } from "lodash";
import { updateRunningStatus } from "../actions/environmentActions";
import { NAMES, RUNNINIG_STATUS } from "../constants/reduxConst";
import { isProduction } from "../utils/commonUtils";

const initialState = {
  runningStatus: RUNNINIG_STATUS.PAUSE,
  lastSleep: undefined,
  footerStatus: false,
  cursorNoneTemp: false,
};

const environmentSlice = createSlice({
  name: NAMES.environment,
  initialState,
  reducers: {
    showFooter: state => {
      state.footerStatus = true;
    },
    hideFooter: state => {
      state.footerStatus = false;
    },
    tryCursorNone: state => {
      state.cursorNoneTemp = true;
    },
    resetCursorNone: state => {
      state.cursorNoneTemp = false;
    },
  },
  extraReducers: {
    [updateRunningStatus.pending]: (state, action) => {
      const lastTimecode = get(action, ["meta", "arg"]);
      const requestId = get(action, ["meta", "requestId"]);
      const isValid = isNumber(lastTimecode);

      if (!isValid) {
        state.runningStatus = RUNNINIG_STATUS.PAUSE;
      }

      if (isValid && state.runningStatus === RUNNINIG_STATUS.PAUSE) {
        state.runningStatus = RUNNINIG_STATUS.RUN;
      }

      if (isValid) {
        state.lastSleep = isProduction ? requestId : lastTimecode;
      }
    },

    [updateRunningStatus.rejected]: noop,

    [updateRunningStatus.fulfilled]: (state, action) => {
      const lastTimecode = get(action, ["meta", "arg"]);
      const requestId = get(action, ["meta", "requestId"]);
      const { lastSleep, runningStatus } = state;
      const isLastRequest = isProduction
        ? requestId === lastSleep
        : lastTimecode === lastSleep;

      if (isLastRequest && runningStatus === RUNNINIG_STATUS.RUN) {
        state.runningStatus = RUNNINIG_STATUS.PAUSE;
      }
    },
  },
});

export const { showFooter, hideFooter, tryCursorNone, resetCursorNone } =
  environmentSlice.actions;

export default environmentSlice;
