import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/dist/query";
import { ipcApi } from "../api/ipc";
// import logger from "redux-logger";

const isProduction = process.env.NODE_ENV === "production";

const store = configureStore({
  reducer: {
    [ipcApi.reducerPath]: ipcApi.reducer,
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
