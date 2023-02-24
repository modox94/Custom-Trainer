const { get } = require("lodash");
const {
  DIR_CONST,
  FILE_CONST,
  MOTOR_FIELDS,
} = require("./src/constants/constants");
const MotorDriver = require("./src/hardware/motor_driver");
const Store = require("./src/software/store");

const store = new Store();
const motor = new MotorDriver(
  get(store.store, [DIR_CONST.SETTINGS, FILE_CONST.PERIPHERAL], {}),
);

const testFn = async () => {
  motor.updateField(MOTOR_FIELDS.SLEEP_RATIO, null);
  store.editSettings(FILE_CONST.PERIPHERAL, MOTOR_FIELDS.SLEEP_RATIO, null);
  const result = await motor.calibration();
  console.log("testFn result", result);
};
testFn();
