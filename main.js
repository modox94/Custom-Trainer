const { app, BrowserWindow, ipcMain, powerSaveBlocker } = require("electron");
const path = require("node:path");
const { rate } = require("./src/hardware/cadence_sensor");
const { motor } = require("./src/hardware/motor_driver");
const { DIR_CONST, Store } = require("./src/software/store");
const { isFunction, get } = require("lodash");

const store = new Store();

const EVENTS = {
  WATCH_CADENCE: "WATCH_CADENCE",
  WATCH_PROGRAMS: "WATCH_PROGRAMS",
  GET_PROGRAMS: "GET_PROGRAMS",
  CHECK_PROGRAM_TITLE: "CHECK_PROGRAM_TITLE",
  SET_FULLSCREEN: "SET_FULLSCREEN",
  SET_MOTOR_LEVEL: "SET_MOTOR_LEVEL",
  STOP_MOTOR: "STOP_MOTOR",
  PREVENT_DISPLAY_SLEEP: "PREVENT_DISPLAY_SLEEP",
  EDIT_PROGRAM: "EDIT_PROGRAM",
  SAVE_NEW_PROGRAM: "SAVE_NEW_PROGRAM",
  DELETE_PROGRAM: "DELETE_PROGRAM",
  APP_QUIT: "APP_QUIT",
};

let win = null;
let preventDisplaySleepID = false;
const preventDisplaySleepFn = (event, flag) => {
  if (flag && !preventDisplaySleepID) {
    preventDisplaySleepID = powerSaveBlocker.start("prevent-display-sleep");
  } else if (!flag && preventDisplaySleepID) {
    powerSaveBlocker.stop(preventDisplaySleepID);
    preventDisplaySleepID = false;
  }
};

const createWindow = () => {
  win = new BrowserWindow({
    width: 800,
    height: 600,
    fullscreenable: true,
    fullscreen: app.isPackaged,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      enableRemoteModule: true,
    },
  });

  if (process.env.ELECTRON_START_URL) {
    win.loadURL(process.env.ELECTRON_START_URL);
  } else {
    win.loadFile("./renderer/build/index.html");
  }
};

app.whenReady().then(() => {
  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

const onQuit = () => {
  try {
    motor.off();
  } catch (error) {
    console.log("motor.off error", error);
  }

  try {
    rate.off();
  } catch (error) {
    console.log("rate.off error", error);
  }

  const watchersObj = get(store, ["watchers"], {});
  const watchersArray = Object.values(watchersObj) || [];
  watchersArray.forEach(watcher => {
    if (isFunction(watcher.close)) {
      watcher.close();
    }
  });

  preventDisplaySleepFn();

  app.quit();
};

app.on("window-all-closed", onQuit);

app.on("will-quit", onQuit);

const onCadenceFn = () => {
  if (isFunction(win?.webContents?.send)) {
    win.webContents.send(EVENTS.WATCH_CADENCE, rate.rpm);
  }
};

onCadenceFn();
rate.cadenceSensor.watch(onCadenceFn);

const onProgramsChange = data => {
  if (isFunction(win?.webContents?.send)) {
    win.webContents.send(EVENTS.WATCH_PROGRAMS, data);
  }
};
store.watch(DIR_CONST.PROGRAMS, onProgramsChange);

ipcMain.handle(EVENTS.GET_PROGRAMS, () => store.store[DIR_CONST.PROGRAMS]);

ipcMain.handle(EVENTS.CHECK_PROGRAM_TITLE, (event, value) => {
  return store.isTitleAvailable(DIR_CONST.PROGRAMS, value);
});

ipcMain.on(EVENTS.SET_FULLSCREEN, () => {
  const isFullScreen = win.isFullScreen();
  win.setFullScreen(!isFullScreen);
});

ipcMain.on(EVENTS.SET_MOTOR_LEVEL, (event, motorLevel) => {
  motor.setLevel(motorLevel);
});

ipcMain.on(EVENTS.STOP_MOTOR, () => {
  motor.stop();
});

ipcMain.on(EVENTS.PREVENT_DISPLAY_SLEEP, preventDisplaySleepFn);

ipcMain.on(EVENTS.SAVE_NEW_PROGRAM, async (event, programObject) =>
  store.createProgram(programObject),
);

ipcMain.on(EVENTS.EDIT_PROGRAM, async (event, filename, programObject) =>
  store.editProgram(filename, programObject),
);

ipcMain.on(EVENTS.DELETE_PROGRAM, async (event, filename) =>
  store.delete(DIR_CONST.PROGRAMS, filename),
);

ipcMain.on(EVENTS.APP_QUIT, onQuit);
