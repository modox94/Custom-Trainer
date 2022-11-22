import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/dist/query";
import ipcApi from "../api/ipc";
import environmentSlice from "../slices/environmentSlice";
import { isProduction } from "../utils/commonUtils";
// import logger from "redux-logger";

const store = configureStore({
  reducer: {
    [ipcApi.reducerPath]: ipcApi.reducer,
    [environmentSlice.name]: environmentSlice.reducer,
  },
  devTools: !isProduction,
  middleware: getDefaultMiddleware =>
    isProduction
      ? getDefaultMiddleware().concat(ipcApi.middleware)
      : getDefaultMiddleware().concat(ipcApi.middleware),
  // : getDefaultMiddleware().concat(ipcApi.middleware, logger),
});

setupListeners(store.dispatch);

export default store;
