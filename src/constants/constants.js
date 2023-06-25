const LANGS_CODES = require("../../renderer/src/constants/LANGS_CODES.json");

const MOTOR_FIELDS = require("../../renderer/src/constants/MOTOR_FIELDS.json");

exports.BOOT_CONFIG_OPT = require("../../renderer/src/constants/BOOT_CONFIG_OPT.json");

exports.BOOT_CONFIG_VALUE = require("../../renderer/src/constants/BOOT_CONFIG_VALUE.json");

exports.CADENCE_FIELDS = require("../../renderer/src/constants/CADENCE_FIELDS.json");

exports.COMMON_CONST = require("../../renderer/src/constants/COMMON_CONST.json");

exports.ERRORS = require("../../renderer/src/constants/ERRORS.json");

exports.EVENTS = require("../../renderer/src/constants/EVENTS.json");

exports.FILE_CONST = require("../../renderer/src/constants/FILE_CONST.json");

exports.LANGS_CODES = LANGS_CODES;

exports.MOTOR_FIELDS = MOTOR_FIELDS;

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

exports.LOADING_TIMER = 5000;

exports.LOADING_PAUSE = 200;

exports.TEST_IN_PROGRESS = "TEST_IN_PROGRESS";

exports.CALIBRATION_ST_CYCLES = 3;

const CALIBRATION_MIN_POINTS = 3;

exports.CALIBRATION_MIN_POINTS = CALIBRATION_MIN_POINTS;

exports.CALIBRATION_MAX_MOVES = 1 + CALIBRATION_MIN_POINTS * 4 + 2;

exports.DOT_JSON = ".json";

exports.ABSOLUTE_DIR_CONST = {
  BOOT: "/boot",
};

exports.DIR_CONST = {
  SETTINGS: "settings",
  EXERCISES: "exercises",
  PROGRAMS: "programs",
};

exports.MOVE_DIRECTION = { forward: "forward", back: "back" };

exports.interfaceDefault = {
  lang: LANGS_CODES.en,
  cursorNone: false,
};

exports.peripheralDefault = {
  [MOTOR_FIELDS.MIN_POS]: null,
  [MOTOR_FIELDS.MAX_POS]: null,
  [MOTOR_FIELDS.SLEEP_RATIO]: null,
  [MOTOR_FIELDS.SWAP_MOTOR_WIRES]: null,
  [MOTOR_FIELDS.SWAP_POTEN_WIRES]: null,
};
