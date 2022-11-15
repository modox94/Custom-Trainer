const { app, BrowserWindow, ipcMain } = require("electron");
const { cadenceSignal, counter } = require("./cadence_sensor.js");
const path = require("node:path");
const { motor } = require("./motor_driver");
const trainingPrograms = require("./training_programs");

const EVENTS = {
  CADENCE: "CADENCE",
  GET_PROGRAMS_LIST: "GET_PROGRAMS_LIST",
  GET_PROGRAM: "GET_PROGRAM",
  MOTOR_SET_LEVEL: "MOTOR_SET_LEVEL",
};

let win = null;
const createWindow = () => {
  win = new BrowserWindow({
    width: 800,
    height: 600,
    fullscreenable: true,
    // fullscreen: true,
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
  if (process.platform !== "darwin") app.quit();
});

const onCadenceFn = () => {
  if (win) {
    win.webContents.send(EVENTS.CADENCE, counter.rpm);
  }
};

if (win) {
  win.webContents.send(EVENTS.CADENCE, counter.rpm);
}

cadenceSignal.watch(onCadenceFn);

ipcMain.handle(EVENTS.GET_PROGRAMS_LIST, async (event, ...args) => {
  return Object.keys(trainingPrograms);
});

ipcMain.handle(EVENTS.GET_PROGRAM, (event, ...args) => {
  const [program] = args;

  return trainingPrograms[program];
});

ipcMain.on(EVENTS.MOTOR_SET_LEVEL, (event, ...args) => {
  const [motorLevel] = args;
  motor.setLevel(motorLevel);
});
