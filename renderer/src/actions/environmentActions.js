import { createAsyncThunk } from "@reduxjs/toolkit";
import { NAMES, PAUSE_DELAY } from "../constants/reduxConst";
import { sleep } from "../utils/commonUtils";

export const updateRunningStatus = createAsyncThunk(
  `${NAMES.environment}/updateRunningStatus`,
  async () => await sleep(PAUSE_DELAY),
);
