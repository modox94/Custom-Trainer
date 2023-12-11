import { get, isFinite, noop } from "lodash";
import { COMMON_CONST } from "../constants/commonConst";
import { DEFAULT_STEPS } from "../constants/programEditorConst";
import { NAMES, RUNNINIG_STATUS } from "../constants/reduxConst";
import { isProduction, sleep } from "../utils/commonUtils";
import { createSlice } from "./createSlice";

const initialState = {
  runningStatus: RUNNINIG_STATUS.PAUSE,
  lastSleep: undefined,
  footerStatus: false,
  cursorNoneTemp: false,
};

const environmentSlice = createSlice({
  name: NAMES.environment,
  initialState,
  reducers: create => ({
    showFooter: create.reducer(state => {
      state.footerStatus = true;
    }),
    hideFooter: create.reducer(state => {
      state.footerStatus = false;
    }),
    tryCursorNone: create.reducer(state => {
      state.cursorNoneTemp = true;
    }),
    resetCursorNone: create.reducer(state => {
      state.cursorNoneTemp = false;
    }),
    setProgramTitle: create.reducer((state, action) => {
      const value = action.payload || "";
      state.programTitle = value;
    }),
    resetProgramTitle: create.reducer(state => {
      state.programTitle = "";
    }),
    setProgramSteps: create.reducer((state, action) => {
      const value = action.payload || DEFAULT_STEPS;
      state.programSteps = value;
    }),
    resetProgramSteps: create.reducer(state => {
      state.programSteps = undefined;
    }),
    updateRunningStatus: create.asyncThunk(
      async () => await sleep(COMMON_CONST.PAUSE_DELAY),
      {
        pending: (state, action) => {
          const lastTimecode = get(action, ["meta", "arg"]);
          const requestId = get(action, ["meta", "requestId"]);
          const isValid = isFinite(lastTimecode);

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
        rejected: noop,
        fulfilled: (state, action) => {
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
    ),
  }),
  selectors: {
    getRunningStatus: state => state.runningStatus,
    getFooterStatus: state => state.footerStatus,
    getCursorNoneTemp: state => state.cursorNoneTemp,
    getProgramTitle: state => state.programTitle || "",
    getProgramSteps: state => state.programSteps,
  },
});

export const {
  showFooter,
  hideFooter,
  tryCursorNone,
  resetCursorNone,
  setProgramTitle,
  resetProgramTitle,
  setProgramSteps,
  resetProgramSteps,
  updateRunningStatus,
} = environmentSlice.actions;

export const {
  getRunningStatus,
  getFooterStatus,
  getCursorNoneTemp,
  getProgramTitle,
  getProgramSteps,
} = environmentSlice.selectors;

export default environmentSlice;
