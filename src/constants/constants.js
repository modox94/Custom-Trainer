exports.EDGE = {
  rising: "rising",
  falling: "falling",
  both: "both",
};

exports.DIRECTION = {
  in: "in",
  high: "high",
  low: "low",
};

exports.PHYSICAL_TO_GPIO = {
  3: 2,
  5: 3,
  7: 4,
  8: 14,
  10: 15,
  11: 17,
  12: 18,
  13: 27,
  15: 22,
  16: 23,
  18: 24,
  19: 10,
  21: 9,
  22: 25,
  23: 11,
  24: 8,
  26: 7,
  29: 5,
  31: 6,
  32: 12,
  33: 13,
  35: 19,
  36: 16,
  37: 26,
  38: 20,
  40: 21,
};

exports.DEV_CONSTS = {
  dataFile: "data.txt",
  LF: "\n",
  PL: "Program launched: ",
  FRQ_R: "frequencyRaw: ",
  FRQ: "frequency: ",
};

exports.DEFAULT_WINDOW = 60;

exports.DEFAULT_M_C = 1;

exports.PAUSE_DELAY = 2500;

exports.EVENTS = {
  WATCH_CADENCE: "WATCH_CADENCE",
  WATCH_PROGRAMS: "WATCH_PROGRAMS",
  GET_PROGRAMS: "GET_PROGRAMS",
  WATCH_SETTINGS: "WATCH_SETTINGS",
  GET_SETTINGS: "GET_SETTINGS",
  CHECK_PROGRAM_TITLE: "CHECK_PROGRAM_TITLE",
  SET_FULLSCREEN: "SET_FULLSCREEN",
  GET_POTENTIOMETER: "GET_POTENTIOMETER",
  DANGER_MOVE_FORWARD: "DANGER_MOVE_FORWARD",
  DANGER_MOVE_BACK: "DANGER_MOVE_BACK",
  SET_MOTOR_LEVEL: "SET_MOTOR_LEVEL",
  STOP_MOTOR: "STOP_MOTOR",
  PREVENT_DISPLAY_SLEEP: "PREVENT_DISPLAY_SLEEP",
  EDIT_PROGRAM: "EDIT_PROGRAM",
  EDIT_SETTINGS: "EDIT_SETTINGS",
  SAVE_NEW_PROGRAM: "SAVE_NEW_PROGRAM",
  DELETE_PROGRAM: "DELETE_PROGRAM",
  APP_QUIT: "APP_QUIT",
};

exports.LANGS_CODES = { en: "en", ru: "ru" };

exports.DIR_CONST = {
  SETTINGS: "settings",
  EXERCISES: "exercises",
  PROGRAMS: "programs",
};

exports.FILE_CONST = {
  INTERFACE: "interface.json",
  PERIPHERAL: "peripheral.json",
};

exports.MOVE_DIRECTION = { forward: "forward", back: "back" };
