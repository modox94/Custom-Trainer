import { createApi } from "@reduxjs/toolkit/query/react";
import { noop } from "lodash";

const EVENTS = { CADENCE: "CADENCE" };

export const api = createApi({
  reducerPath: "ipcApi",
  endpoints: build => ({
    getCadence: build.query({
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
      // getPrograms:
    }),
  }),
});

export const { useGetCadenceQuery } = api;
