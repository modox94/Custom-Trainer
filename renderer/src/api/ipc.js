import { createApi } from "@reduxjs/toolkit/query/react";
import { noop } from "lodash";
import { EVENTS, FILE_CONST, NAMES } from "../constants/reduxConst";

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
    getSettings: builder.query({
      queryFn: async () => {
        const data = await window.electron.ipcRenderer.invoke(
          EVENTS.GET_SETTINGS,
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
            EVENTS.WATCH_SETTINGS,
            listener,
          );
        } catch (error) {
          console.log("ipc error", error);
        }

        await cacheEntryRemoved;
        removeListener();
      },
    }),
    getPotentiometer: builder.query({
      queryFn: async () => {
        const data = await window.electron.ipcRenderer.invoke(
          EVENTS.GET_POTENTIOMETER,
        );
        return { data };
      },
    }),
  }),
});

export const checkProgramTitle = (...args) =>
  window.electron.ipcRenderer.invoke(EVENTS.CHECK_PROGRAM_TITLE, ...args);

export const setFullScreen = () =>
  window.electron.ipcRenderer.send(EVENTS.SET_FULLSCREEN);

export const DANGERmoveForward = async () => {
  return await window.electron.ipcRenderer.invoke(EVENTS.DANGER_MOVE_FORWARD);
};

export const DANGERmoveBack = async () => {
  return await window.electron.ipcRenderer.invoke(EVENTS.DANGER_MOVE_BACK);
};

export const motorCalibration = async () => {
  return await window.electron.ipcRenderer.invoke(EVENTS.MOTOR_CALIBRATION);
};

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

export const deleteProgram = filename =>
  window.electron.ipcRenderer.send(EVENTS.DELETE_PROGRAM, filename);

export const editSettings = (filename, field, value) => {
  if (Object.values(FILE_CONST).includes(filename)) {
    window.electron.ipcRenderer.send(
      EVENTS.EDIT_SETTINGS,
      filename,
      field,
      value,
    );
  } else {
    console.log("error invalid filename");
  }
};

export const appQuit = () => window.electron.ipcRenderer.send(EVENTS.APP_QUIT);

export const {
  useGetCadenceQuery,
  useGetProgramsQuery,
  useGetSettingsQuery,
  useGetPotentiometerQuery,
} = ipcApi;
export default ipcApi;
