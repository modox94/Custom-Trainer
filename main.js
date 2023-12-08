const {
  app,
  BrowserWindow,
  dialog,
  ipcMain,
  Menu,
  powerSaveBlocker,
} = require("electron");
const { get, isFunction, isPlainObject } = require("lodash");
const { DateTime } = require("luxon");
const fs = require("node:fs");
const path = require("node:path");
const sudo = require("sudo-prompt");
const {
  ABSOLUTE_DIR_CONST,
  BOOT_CONFIG_OPT,
  CADENCE_FIELDS,
  COMMON_CONST,
  DIR_CONST,
  DOT_JSON,
  ERRORS,
  EVENTS,
  FILE_CONST,
  interfaceDefault,
  MOTOR_FIELDS,
  MOVE_DIRECTION,
  peripheralDefault,
} = require("./src/constants/constants");
const Frequency = require("./src/hardware/cadence_sensor");
const MotorDriver = require("./src/hardware/motor_driver");
const { aplicationMenu } = require("./src/software/aplication_menu");
const Store = require("./src/software/store");
const {
  validateInterface,
  validatePeripheral,
  validateProgram,
} = require("./src/software/validators");
const { commentConfigOpt, convertConfigToObj } = require("./src/utils/utils");

Menu.setApplicationMenu(aplicationMenu);

const store = new Store();
const settingsPeripheral = get(
  store.store,
  [DIR_CONST.SETTINGS, FILE_CONST.PERIPHERAL],
  {},
);
const rate = new Frequency(settingsPeripheral);
const motor = new MotorDriver(settingsPeripheral);

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
};

app.on("window-all-closed", app.quit.bind(app));

app.on("will-quit", onQuit);

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

if (!app.requestSingleInstanceLock()) {
  app.quit();
} else {
  app.on("second-instance", () => {
    if (win) {
      if (win.isMinimized()) {
        win.restore();
      }
      win.focus();
    }
  });

  app.whenReady().then(() => {
    createWindow();

    if (!app.requestSingleInstanceLock()) {
      app.quit();
    }

    app.on("activate", () => {
      if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
      }
    });
  });
}

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

const onBootChange = dataRaw => {
  if (isFunction(win?.webContents?.send)) {
    const data = get(dataRaw, [FILE_CONST.CONFIG], null);
    win.webContents.send(EVENTS.WATCH_BOOT, convertConfigToObj(data));
  }
};
store.watch(store.constants[ABSOLUTE_DIR_CONST.BOOT], onBootChange);

ipcMain.handle(EVENTS.GET_BOOT, () =>
  convertConfigToObj(
    get(store.store, [
      store.constants[ABSOLUTE_DIR_CONST.BOOT],
      FILE_CONST.CONFIG,
    ]),
  ),
);

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

ipcMain.handle(EVENTS.EDIT_BOOT_CONFIG, async (event, opt, value) => {
  switch (opt) {
    case BOOT_CONFIG_OPT.SPI:
      if (value) {
        const configData = get(store.store, [
          store.constants[ABSOLUTE_DIR_CONST.BOOT],
          FILE_CONST.CONFIG,
        ]);
        let newConfigData = commentConfigOpt(configData, opt);
        newConfigData += `${COMMON_CONST.LINE_FEED}${BOOT_CONFIG_OPT.ALL}${COMMON_CONST.LINE_FEED}${BOOT_CONFIG_OPT.DTPARAM}=${BOOT_CONFIG_OPT.SPI}=${value}`;
        const fullConfigPath = path.join(
          ABSOLUTE_DIR_CONST.BOOT,
          FILE_CONST.CONFIG,
        );
        const sudoCommand = `echo "${newConfigData}" > ${fullConfigPath}`;
        const options = { name: "Custom Trainer" };
        const [error, stdout, stderr] = (await new Promise(resolve => {
          sudo.exec(sudoCommand, options, function (...args) {
            resolve(args);
          });
        })) || [ERRORS.BOOT_CONFIG_WRONG_ARGS];

        if (get(error, ["message"], "") === "User did not grant permission.") {
          return [ERRORS.SUDO_NOT_GRANT_PERMISSION, stdout, stderr];
        }

        return [error, stdout, stderr];
      }
      return [ERRORS.BOOT_CONFIG_WRONG_ARGS];

    default:
      return [ERRORS.BOOT_CONFIG_WRONG_ARGS];
  }
});

ipcMain.handle(EVENTS.MOTOR_CALIB_DIRECTION_TEST, async () => {
  // if (Math.random() * 10 > 5) {
  //   return true;
  // }

  const result = await motor.calibrationDirectionTest();
  return result;
});

ipcMain.handle(EVENTS.MOTOR_CALIB_CALC_SLEEP_RATIO, async () => {
  const result = await motor.calibrationCalcSleepRatio();
  return result;
});

ipcMain.handle(EVENTS.GET_MOTOR_LEVEL, async () => {
  return await motor.getMotorLevel();
});

ipcMain.on(EVENTS.SET_MOTOR_LEVEL, (event, motorLevel) => {
  motor.setLevel(motorLevel);
});

ipcMain.on(EVENTS.STOP_MOTOR, () => {
  motor.actionCancel();
  motor.stop();
});

ipcMain.on(EVENTS.PREVENT_DISPLAY_SLEEP, preventDisplaySleepFn);

ipcMain.on(EVENTS.SAVE_NEW_PROGRAM, async (event, programObject) =>
  store.createProgram(programObject),
);

ipcMain.on(EVENTS.EDIT_PROGRAM, async (event, filename, programObject) =>
  store.editProgram(filename, programObject),
);

const editSettingsFn = (event, filename, data) => {
  if (!isPlainObject(data)) {
    console.log("invalid data", data);
  }
  for (const field in data) {
    if (Object.hasOwnProperty.call(data, field)) {
      const value = data[field];
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

            case CADENCE_FIELDS.GEAR_RATIO:
              rate.updateField(field, value);
              break;

            default:
              break;
          }

          break;
        }

        default:
          break;
      }
    }
  }

  store.editSettings(filename, data);
};

ipcMain.on(EVENTS.EDIT_SETTINGS, editSettingsFn);

ipcMain.on(EVENTS.DELETE_PROGRAM, async (event, filename) =>
  store.delete(DIR_CONST.PROGRAMS, filename),
);

ipcMain.on(EVENTS.SAVE_TO_PROGRAM, async (event, filename) => {
  const file = get(store.store, [DIR_CONST.PROGRAMS, filename]);

  const res = await dialog.showSaveDialog({
    defaultPath: filename,
    properties: ["showOverwriteConfirmation"],
  });
  const { canceled, filePath } = res || {};

  if (!canceled && filePath.length > 0) {
    fs.writeFileSync(filePath, JSON.stringify(file));
  }
});

ipcMain.handle(EVENTS.LOAD_FROM_PROGRAM, async () => {
  const res = await dialog.showOpenDialog({ properties: ["openFile"] });
  const { canceled, filePaths } = res || {};

  if (canceled) {
    return { error: ERRORS.PROMISE_CANCELLED };
  }

  if (filePaths?.length > 0 && filePaths[0]?.length > 0) {
    let programObj;
    try {
      programObj = JSON.parse(
        fs.readFileSync(filePaths[0], { encoding: "utf-8" }),
      );
    } catch (error) {
      return { error: ERRORS.INVALID_FILE };
    }

    if (validateProgram(programObj)) {
      store.createProgram(programObj);
      return { data: programObj };
    }
  }

  return { error: ERRORS.UNKNOWN_ERROR };
});

ipcMain.on(EVENTS.SAVE_TO_SETTINGS, async () => {
  const file = get(store.store, [DIR_CONST.SETTINGS]);

  const res = await dialog.showSaveDialog({
    defaultPath: `custom_trainer_settings_${DateTime.now().toFormat(
      "yy-MM-dd_HH:mm:ss",
    )}${DOT_JSON}`,
    properties: ["showOverwriteConfirmation"],
  });
  const { canceled, filePath } = res || {};

  if (!canceled && filePath.length > 0) {
    fs.writeFileSync(filePath, JSON.stringify(file));
  }
});

ipcMain.handle(EVENTS.LOAD_FROM_SETTINGS, async () => {
  const res = await dialog.showOpenDialog({ properties: ["openFile"] });
  const { canceled, filePaths } = res || {};

  if (canceled) {
    return { error: ERRORS.PROMISE_CANCELLED };
  }

  if (filePaths?.length > 0 && filePaths[0]?.length > 0) {
    let settingsObj;
    try {
      settingsObj = JSON.parse(
        fs.readFileSync(filePaths[0], { encoding: "utf-8" }),
      );
    } catch (error) {
      return { error: ERRORS.INVALID_FILE };
    }

    if (
      isPlainObject(settingsObj) &&
      validateInterface(settingsObj[FILE_CONST.INTERFACE]) &&
      validatePeripheral(settingsObj[FILE_CONST.PERIPHERAL])
    ) {
      editSettingsFn(
        undefined,
        FILE_CONST.INTERFACE,
        settingsObj[FILE_CONST.INTERFACE],
      );
      editSettingsFn(
        undefined,
        FILE_CONST.PERIPHERAL,
        settingsObj[FILE_CONST.PERIPHERAL],
      );

      return { data: true };
    }
  }

  return { error: ERRORS.UNKNOWN_ERROR };
});

ipcMain.on(EVENTS.RESET_SETTINGS, async () => {
  editSettingsFn(undefined, FILE_CONST.INTERFACE, interfaceDefault);
  editSettingsFn(undefined, FILE_CONST.PERIPHERAL, peripheralDefault);
});

ipcMain.on(EVENTS.APP_QUIT, app.quit.bind(app));
