import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/dist/query";
import logger from "redux-logger";
import { api as ipcApi } from "../api/ipc";

const isProduction = process.env.NODE_ENV === "production";

const store = configureStore({
  reducer: {
    [ipcApi.reducerPath]: ipcApi.reducer,
  },
  devTools: !isProduction,
  middleware: getDefaultMiddleware =>
    isProduction
      ? getDefaultMiddleware().concat(ipcApi.middleware)
      : getDefaultMiddleware().concat(ipcApi.middleware, logger),
  // : getDefaultMiddleware().concat(ipcApi.middleware),
});

setupListeners(store.dispatch);

export default store;
