import { createAsyncThunk } from "@reduxjs/toolkit";
import { COMMON_CONST } from "../constants/commonConst";
import { NAMES } from "../constants/reduxConst";
import { sleep } from "../utils/commonUtils";

export const updateRunningStatus = createAsyncThunk(
  `${NAMES.environment}/updateRunningStatus`,
  async () => await sleep(COMMON_CONST.PAUSE_DELAY),
);
