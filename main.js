const { app, BrowserWindow, ipcMain, powerSaveBlocker } = require("electron");
const path = require("node:path");
const { rate } = require("./src/hardware/cadence_sensor");
const MotorDriver = require("./src/hardware/motor_driver");
const Store = require("./src/software/store");
const { isFunction, get } = require("lodash");
const {
  DIR_CONST,
  EVENTS,
  FILE_CONST,
  MOVE_DIRECTION,
  MOTOR_FIELDS,
} = require("./src/constants/constants");

const store = new Store();
const motor = new MotorDriver(
  get(store.store, [DIR_CONST.SETTINGS, FILE_CONST.PERIPHERAL], {}),
);

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

const onSettingsChange = data => {
  if (isFunction(win?.webContents?.send)) {
    win.webContents.send(EVENTS.WATCH_SETTINGS, data);
  }
};
store.watch(DIR_CONST.SETTINGS, onSettingsChange);

ipcMain.handle(EVENTS.GET_SETTINGS, () => store.store[DIR_CONST.SETTINGS]);

ipcMain.handle(EVENTS.CHECK_PROGRAM_TITLE, (event, value) => {
  return store.isTitleAvailable(DIR_CONST.PROGRAMS, value);
});

ipcMain.on(EVENTS.SET_FULLSCREEN, () => {
  const isFullScreen = win.isFullScreen();
  win.setFullScreen(!isFullScreen);
});

ipcMain.handle(EVENTS.GET_POTENTIOMETER, async () => {
  return await motor.readPosition();
});

ipcMain.handle(EVENTS.DANGER_MOVE_FORWARD, async () => {
  return await motor.DANGER_move(MOVE_DIRECTION.forward);
});

ipcMain.handle(EVENTS.DANGER_MOVE_BACK, async () => {
  return await motor.DANGER_move(MOVE_DIRECTION.back);
});

ipcMain.handle(EVENTS.MOTOR_CALIBRATION, async () => {
  motor.updateField(MOTOR_FIELDS.SLEEP_RATIO, null);
  store.editSettings(FILE_CONST.PERIPHERAL, MOTOR_FIELDS.SLEEP_RATIO, null);
  return await motor.calibration();
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

ipcMain.on(EVENTS.EDIT_SETTINGS, async (event, filename, field, value) => {
  switch (filename) {
    case FILE_CONST.PERIPHERAL: {
      switch (field) {
        case MOTOR_FIELDS.MIN_POS:
        case MOTOR_FIELDS.MAX_POS:
        case MOTOR_FIELDS.SLEEP_RATIO:
        case MOTOR_FIELDS.SWAP_MOTOR_WIRES:
        case MOTOR_FIELDS.SWAP_POTEN_WIRES:
          motor.updateField(field, value);
          break;

        default:
          break;
      }

      break;
    }

    default:
      break;
  }

  store.editSettings(filename, field, value);
});

ipcMain.on(EVENTS.DELETE_PROGRAM, async (event, filename) =>
  store.delete(DIR_CONST.PROGRAMS, filename),
);

ipcMain.on(EVENTS.APP_QUIT, onQuit);
