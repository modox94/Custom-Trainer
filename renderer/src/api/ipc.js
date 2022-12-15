import { createApi } from "@reduxjs/toolkit/query/react";
import { noop } from "lodash";
import { EVENTS, NAMES } from "../constants/reduxConst";

const ipcApi = createApi({
  reducerPath: NAMES.ipcApi,
  endpoints: builder => ({
    getCadence: builder.query({
      queryFn: () => ({ result: 0 }),
      async onCacheEntryAdded(
        arg,
        { updateCachedData, cacheDataLoaded, cacheEntryRemoved },
      ) {
        let removeListener = noop;
        try {
          await cacheDataLoaded;
          const listener = rpmObject => updateCachedData(() => rpmObject);
          removeListener = window.electron.ipcRenderer.on(
            EVENTS.WATCH_CADENCE,
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
          EVENTS.GET_PROGRAMS,
        );
        return { data };
      },
      async onCacheEntryAdded(
        arg,
        { updateCachedData, cacheDataLoaded, cacheEntryRemoved },
      ) {
        let removeListener = noop;
        try {
          await cacheDataLoaded;
          const listener = storeData => updateCachedData(() => storeData);
          removeListener = window.electron.ipcRenderer.on(
            EVENTS.WATCH_PROGRAMS,
            listener,
          );
        } catch (error) {
          console.log("ipc error", error);
        }

        await cacheEntryRemoved;
        removeListener();
      },
    }),
  }),
});

export const checkProgramTitle = (...args) =>
  window.electron.ipcRenderer.invoke(EVENTS.CHECK_PROGRAM_TITLE, ...args);

export const setFullScreen = () =>
  window.electron.ipcRenderer.send(EVENTS.SET_FULLSCREEN);

export const setMotorLevel = motorLevel =>
  window.electron.ipcRenderer.send(EVENTS.SET_MOTOR_LEVEL, motorLevel);

export const stopMotor = () =>
  window.electron.ipcRenderer.send(EVENTS.STOP_MOTOR);

export const preventDisplaySleep = flag =>
  window.electron.ipcRenderer.send(EVENTS.PREVENT_DISPLAY_SLEEP, flag);

export const saveNewProgram = programObject =>
  window.electron.ipcRenderer.send(EVENTS.SAVE_NEW_PROGRAM, programObject);

export const editProgram = (filename, programObject) =>
  window.electron.ipcRenderer.send(
    EVENTS.EDIT_PROGRAM,
    filename,
    programObject,
  );

export const appQuit = () => window.electron.ipcRenderer.send(EVENTS.APP_QUIT);

export const { useGetCadenceQuery, useGetProgramsQuery } = ipcApi;
export default ipcApi;
