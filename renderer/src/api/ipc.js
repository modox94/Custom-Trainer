import { createApi } from "@reduxjs/toolkit/query/react";
import { noop } from "lodash";

const EVENTS = {
  CADENCE: "CADENCE",
  GET_PROGRAMS_LIST: "GET_PROGRAMS_LIST",
  GET_PROGRAM: "GET_PROGRAM",
  MOTOR_SET_LEVEL: "MOTOR_SET_LEVEL",
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
          const listener = rpmValue => {
            updateCachedData(() => {
              return rpmValue;
            });
          };
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
    getPrograms: builder.query({
      queryFn: async () => {
        const data = await window.electron.ipcRenderer.invoke(
          EVENTS.GET_PROGRAMS_LIST,
        );
        return { data };
      },
    }),
  }),
});

export const { useGetCadenceQuery, useGetProgramsQuery } = ipcApi;
