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

export const preventDisplaySleep = flag =>
  window.electron.ipcRenderer.send(EVENTS.PREVENT_DISPLAY_SLEEP, flag);

export const saveNewProgram = programObject =>
  window.electron.ipcRenderer.send(EVENTS.SAVE_NEW_PROGRAM, programObject);

export const appQuit = () => window.electron.ipcRenderer.send(EVENTS.APP_QUIT);

export const {
  useGetCadenceQuery,
  useGetProgramsListQuery,
  useGetProgramQuery,
} = ipcApi;
export default ipcApi;
