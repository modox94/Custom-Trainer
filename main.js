const { app, BrowserWindow, ipcMain, powerSaveBlocker } = require("electron");
const { cadenceSignal, counter } = require("./cadence_sensor.js");
const path = require("node:path");
const { motor } = require("./motor_driver");
const trainingPrograms = require("./training_programs");

const isProduction = process.env.NODE_ENV === "production";

const EVENTS = {
  WATCH_CADENCE: "WATCH_CADENCE",
  GET_PROGRAMS_LIST: "GET_PROGRAMS_LIST",
  GET_PROGRAM: "GET_PROGRAM",
  SET_FULLSCREEN: "SET_FULLSCREEN",
  SET_MOTOR_LEVEL: "SET_MOTOR_LEVEL",
  STOP_MOTOR: "STOP_MOTOR",
  PREVENT_DISPLAY_SLEEP: "PREVENT_DISPLAY_SLEEP",
};

let win = null;
const createWindow = () => {
  win = new BrowserWindow({
    width: 800,
    height: 600,
    fullscreenable: true,
    fullscreen: isProduction,
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

app.on("window-all-closed", () => {
  motor.stop();
});

const onCadenceFn = () => {
  if (win?.webContents?.send) {
    win.webContents.send(EVENTS.WATCH_CADENCE, counter.rpm);
  }
};

onCadenceFn();
cadenceSignal.watch(onCadenceFn);

ipcMain.handle(EVENTS.GET_PROGRAMS_LIST, async (event, ...args) => {
  return Object.keys(trainingPrograms);
});

ipcMain.handle(EVENTS.GET_PROGRAM, (event, ...args) => {
  const [program] = args;

  return trainingPrograms[program];
});

ipcMain.on(EVENTS.SET_FULLSCREEN, (event, ...args) => {
  const isFullScreen = win.isFullScreen();
  win.setFullScreen(!isFullScreen);
});

ipcMain.on(EVENTS.SET_MOTOR_LEVEL, (event, motorLevel) => {
  motor.setLevel(motorLevel);
});

ipcMain.on(EVENTS.STOP_MOTOR, () => {
  motor.stop();
});

let preventDisplaySleepID = false;
ipcMain.on(EVENTS.PREVENT_DISPLAY_SLEEP, (event, flag) => {
  if (flag && !preventDisplaySleepID) {
    preventDisplaySleepID = powerSaveBlocker.start("prevent-display-sleep");
  } else if (!flag && preventDisplaySleepID) {
    powerSaveBlocker.stop(preventDisplaySleepID);
    preventDisplaySleepID = false;
  }
});
