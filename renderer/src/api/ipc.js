import { createApi } from "@reduxjs/toolkit/query/react";
import { noop } from "lodash";

const EVENTS = {
  CADENCE: "CADENCE",
  GET_PROGRAMS_LIST: "GET_PROGRAMS_LIST",
  GET_PROGRAM: "GET_PROGRAM",
  SET_FULLSCREEN: "SET_FULLSCREEN",
  SET_MOTOR_LEVEL: "SET_MOTOR_LEVEL",
  STOP_MOTOR: "STOP_MOTOR",
};

export const ipcApi = createApi({
  reducerPath: "ipcApi",
  endpoints: builder => ({
    getCadence: builder.query({
      queryFn: () => 0,
      async onCacheEntryAdded(
        arg,
        { updateCachedData, cacheDataLoaded, cacheEntryRemoved },
      ) {
        let removeListener = noop;
        try {
          await cacheDataLoaded;
          const listener = rpmValue => updateCachedData(() => rpmValue);
          removeListener = window.electron.ipcRenderer.on(
            EVENTS.CADENCE,
            listener,
          );
        } catch (error) {
          console.log("ipc error", error);
        }

        await cacheEntryRemoved;
        removeListener();
      },
    }),
    getProgramsList: builder.query({
      queryFn: async () => {
        const data = await window.electron.ipcRenderer.invoke(
          EVENTS.GET_PROGRAMS_LIST,
        );
        return { data };
      },
    }),
    getProgram: builder.query({
      queryFn: async programTitle => {
        const data = await window.electron.ipcRenderer.invoke(
          EVENTS.GET_PROGRAM,
          programTitle,
        );
        return { data };
      },
    }),
  }),
});

export const setFullScreen = () =>
  window.electron.ipcRenderer.send(EVENTS.SET_FULLSCREEN);

export const setMotorLevel = motorLevel =>
  window.electron.ipcRenderer.send(EVENTS.SET_MOTOR_LEVEL, motorLevel);

export const stopMotor = () =>
  window.electron.ipcRenderer.send(EVENTS.STOP_MOTOR);

export const {
  useGetCadenceQuery,
  useGetProgramsListQuery,
  useGetProgramQuery,
} = ipcApi;
