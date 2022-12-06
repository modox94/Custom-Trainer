const { app, BrowserWindow, ipcMain, powerSaveBlocker } = require("electron");
const path = require("node:path");
const { rate } = require("./src/hardware/cadence_sensor.js");
const { motor } = require("./src/hardware/motor_driver");
const defaultTrainingPrograms = require("./default_training_programs");
const { DIR_CONST, StoreDir, StoreFile } = require("./src/software/store");
const { camelCase } = require("lodash");
const filenamify = require("filenamify");
const unusedFilename = require("unused-filename");
const fs = require("node:fs");

const dir = new StoreDir();

const isProduction = process.env.NODE_ENV === "production";

const EVENTS = {
  WATCH_CADENCE: "WATCH_CADENCE",
  GET_PROGRAMS_LIST: "GET_PROGRAMS_LIST",
  GET_PROGRAM: "GET_PROGRAM",
  SET_FULLSCREEN: "SET_FULLSCREEN",
  SET_MOTOR_LEVEL: "SET_MOTOR_LEVEL",
  STOP_MOTOR: "STOP_MOTOR",
  PREVENT_DISPLAY_SLEEP: "PREVENT_DISPLAY_SLEEP",
  SAVE_NEW_PROGRAM: "SAVE_NEW_PROGRAM",
  APP_QUIT: "APP_QUIT",
};

const seedPrograms = () => {
  defaultTrainingPrograms.forEach(programObj => {
    const { title } = programObj;

    const file = dir.read([DIR_CONST.PROGRAMS], `${camelCase(title)}.json`);

    for (const key in programObj) {
      if (Object.hasOwnProperty.call(programObj, key)) {
        const value = programObj[key];
        file.set([key], value);
      }
    }
  });
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

  preventDisplaySleepFn();

  app.quit();
};

app.on("window-all-closed", onQuit);

app.on("will-quit", onQuit);

const onCadenceFn = () => {
  if (win?.webContents?.send) {
    win.webContents.send(EVENTS.WATCH_CADENCE, rate.rpm);
  }
};

onCadenceFn();
rate.cadenceSensor.watch(onCadenceFn);

ipcMain.handle(EVENTS.GET_PROGRAMS_LIST, async () => {
  let programsDir = dir.read([DIR_CONST.PROGRAMS]);
  const isEmptyDir = programsDir.length === 0;

  if (isEmptyDir) {
    seedPrograms();
    programsDir = dir.read([DIR_CONST.PROGRAMS]);
  }

  const programsTitles = programsDir.map(fileName => {
    const file = new StoreFile({ pathArray: [DIR_CONST.PROGRAMS], fileName });
    const title = file.get(["title"]);
    return [fileName, title];
  });

  return programsTitles;
});

ipcMain.handle(EVENTS.GET_PROGRAM, (event, fileName) => {
  const file = new StoreFile({ pathArray: [DIR_CONST.PROGRAMS], fileName });
  return file.data;
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

ipcMain.on(EVENTS.PREVENT_DISPLAY_SLEEP, preventDisplaySleepFn);

ipcMain.on(EVENTS.SAVE_NEW_PROGRAM, async (event, programObject) => {
  const userDataPath = app.getPath("userData");
  const { title } = programObject;
  const fileName = filenamify(title, { replacement: "_" });
  const filePath = await unusedFilename(
    path.join(userDataPath, DIR_CONST.PROGRAMS, `${fileName}.json`),
  );

  fs.writeFileSync(filePath, JSON.stringify(programObject));
});

ipcMain.on(EVENTS.APP_QUIT, onQuit);
