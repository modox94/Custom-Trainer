const cors = require("cors");
const express = require("express");
const Redis = require("ioredis");
const {
  camelCase,
  get,
  isPlainObject,
  merge,
  random,
  set,
  unset,
} = require("lodash");
const path = require("node:path");
const WebSocket = require("ws");
const defaultTrainingPrograms = require("./default_training_programs");
const {
  ABSOLUTE_DIR_CONST,
  BOOT_CONFIG_OPT,
  BOOT_CONFIG_VALUE,
  CADENCE_FIELDS,
  COMMON_CONST,
  DIR_CONST,
  DOT_JSON,
  EVENTS,
  FILE_CONST,
  MOTOR_FIELDS,
  interfaceDefault,
  peripheralDefault,
} = require("./src/constants/constants");
const Frequency = require("./src/hardware/cadence_sensor");
const MotorDriver = require("./src/hardware/motor_driver");
const { convertConfigToObj, sleep } = require("./src/utils/utils");

const DELAY = 100; // TODO
const PORT = process.env.PORT ?? 3001;

const redis = new Redis(process.env.REDIS_URL);

let wsServer;
const wsSend = data => {
  const clients = get(wsServer, ["clients"], []);
  if (!isPlainObject(data)) {
    console.log("Invalid ws data.");
    return;
  }

  clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(data), { binary: false });
    }
  });
};

const getBootConfigString = (obj = {}) => {
  let result = `${BOOT_CONFIG_OPT.LCD_ROTATE}=`;

  if (obj[BOOT_CONFIG_OPT.LCD_ROTATE]) {
    result += obj[BOOT_CONFIG_OPT.LCD_ROTATE];
  } else {
    result += "2";
  }

  result += `${COMMON_CONST.LINE_FEED}${BOOT_CONFIG_OPT.DTPARAM}=${BOOT_CONFIG_OPT.SPI}=`;

  if (obj[BOOT_CONFIG_OPT.SPI]) {
    result += obj[BOOT_CONFIG_OPT.SPI];
  } else {
    result += BOOT_CONFIG_VALUE.OFF;
  }

  return result;
};

const dbDefaultInstance = {
  [DIR_CONST.PROGRAMS]: {},
  [DIR_CONST.SETTINGS]: {
    [FILE_CONST.INTERFACE]: interfaceDefault,
    [FILE_CONST.PERIPHERAL]: peripheralDefault,
  },
  [ABSOLUTE_DIR_CONST.BOOT]: {
    [FILE_CONST.CONFIG]: getBootConfigString(),
  },
};

defaultTrainingPrograms.forEach(defaultProgram => {
  const filename = `${camelCase(defaultProgram.title)}${DOT_JSON}`;
  set(dbDefaultInstance, [DIR_CONST.PROGRAMS, filename], defaultProgram);
});

const dbSeed = async () => {
  for (const key in dbDefaultInstance) {
    if (Object.hasOwnProperty.call(dbDefaultInstance, key)) {
      const value = dbDefaultInstance[key];
      redis.set(key, JSON.stringify(value));
    }
  }
};
dbSeed();
setInterval(dbSeed, 10800000);

const redisSet = async (key, value) => {
  if (!key) {
    console.log("Invalid redis set key", key);
    return false;
  }

  let valueString;

  try {
    valueString = JSON.stringify(value);
  } catch (error) {
    console.log("Invalid redis set data");
    console.log("key", key);
    console.log("value", value);
  }

  if (!valueString) {
    valueString = JSON.stringify({});
  }

  await redis.set(key, valueString);

  return true;
};

const redisGet = async key => {
  if (!key) {
    console.log("Invalid redis get key", key);
    return {};
  }

  let result;
  const redisValue = await redis.get(key);

  if (redisValue) {
    try {
      result = JSON.parse(redisValue);
    } catch (error) {
      console.log("Invalid redis get data");
      console.log("key", key);
      console.log("redisValue", redisValue);
    }
  }

  if (!result) {
    result = get(dbDefaultInstance, [key], {});
    redisSet(key, result);
  }

  return result;
};

const settingsPeripheral = get(
  dbDefaultInstance,
  [DIR_CONST.SETTINGS, FILE_CONST.PERIPHERAL],
  {},
);

const motor = new MotorDriver(settingsPeripheral);
const rate = new Frequency(settingsPeripheral);

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const buildPath = "renderer/build";
app.use(express.static(path.join(__dirname, buildPath)));
app.get("/", (req, res) =>
  res.sendFile(path.join(__dirname, buildPath, "index.html")),
);

app.post("/invoke", async (req, res) => {
  const event = get(req, ["body", "event"], "");
  const args = get(req, ["body", "args"], []);

  switch (event) {
    case EVENTS.GET_BOOT: {
      const bootDir = await redisGet(ABSOLUTE_DIR_CONST.BOOT);
      const bootConfig = get(bootDir, [FILE_CONST.CONFIG], "");
      res.status(200).send(convertConfigToObj(bootConfig));
      break;
    }

    case EVENTS.GET_SETTINGS: {
      const settingsDir = await redisGet(DIR_CONST.SETTINGS);
      res.status(200).send(settingsDir);
      break;
    }

    case EVENTS.GET_PROGRAMS: {
      const programsDir = await redisGet(DIR_CONST.PROGRAMS);
      res.status(200).send(programsDir);
      break;
    }

    case EVENTS.GET_POTENTIOMETER: {
      const position = await motor.readPosition();
      res.status(200).send(JSON.stringify(position));
      break;
    }

    case EVENTS.GET_MOTOR_LEVEL: {
      const motorLevel = await motor.getMotorLevel();
      res.status(200).send(JSON.stringify(motorLevel));
      break;
    }

    case EVENTS.CHECK_PROGRAM_TITLE: {
      const [title] = args;
      const programsDir = await redisGet(DIR_CONST.PROGRAMS);
      const findResult = Object.values(programsDir).find(
        program => program.title === title,
      );

      res.status(200).send(!findResult);
      break;
    }

    case EVENTS.DANGER_MOVE_FORWARD: {
      await sleep(DELAY);
      res.status(200).send({ error: false });
      break;
    }

    case EVENTS.DANGER_MOVE_BACK: {
      await sleep(DELAY);
      res.status(200).send({ error: false });
      break;
    }

    case EVENTS.MOTOR_CALIB_DIRECTION_TEST: {
      await sleep(DELAY * 5);
      res.status(200).send(true);
      break;
    }

    case EVENTS.MOTOR_CALIB_CALC_SLEEP_RATIO: {
      await sleep(DELAY * 10);
      const result = random(30, 50);
      res.status(200).send(JSON.stringify(result * 100));
      break;
    }

    case EVENTS.EDIT_BOOT_CONFIG: {
      const [opt, value] = args;
      const bootDir = await redisGet(ABSOLUTE_DIR_CONST.BOOT);

      set(bootDir, [FILE_CONST.CONFIG], getBootConfigString({ [opt]: value }));
      redisSet(ABSOLUTE_DIR_CONST.BOOT, bootDir);

      wsSend({
        event: EVENTS.WATCH_BOOT,
        payload: convertConfigToObj(bootDir[FILE_CONST.CONFIG]),
      });

      res.status(200).send([]);
      break;
    }

    default:
      res.status(400).send();
      break;
  }
});

app.post("/send", async (req, res) => {
  const event = get(req, ["body", "event"], "");
  const args = get(req, ["body", "args"], []);

  switch (event) {
    case EVENTS.SET_FULLSCREEN: {
      // do nothing
      res.status(200).send();
      break;
    }

    case EVENTS.SET_MOTOR_LEVEL: {
      // const [motorLevel] = args;
      // do nothing
      res.status(200).send();
      break;
    }

    case EVENTS.STOP_MOTOR: {
      // do nothing
      res.status(200).send();
      break;
    }

    case EVENTS.PREVENT_DISPLAY_SLEEP: {
      // const [flag] = args;
      // do nothing
      res.status(200).send();
      break;
    }

    case EVENTS.SAVE_NEW_PROGRAM: {
      const [data] = args;
      const programsDir = await redisGet(DIR_CONST.PROGRAMS);

      let filename = `${camelCase(data.title)}${DOT_JSON}`;
      let iterator = 0;
      while (get(programsDir, [filename]) && iterator < 100) {
        iterator += 1;
        filename = `${camelCase(data.title)}_(${iterator})${DOT_JSON}`;
      }

      if (get(programsDir, [filename])) {
        console.log("error cant save program");
        return;
      }

      set(programsDir, [filename], data);
      redisSet(DIR_CONST.PROGRAMS, programsDir);

      wsSend({ event: EVENTS.WATCH_PROGRAMS, payload: programsDir });

      res.status(200).send();
      break;
    }

    case EVENTS.EDIT_PROGRAM: {
      const [filename, data] = args;
      const programsDir = await redisGet(DIR_CONST.PROGRAMS);

      set(programsDir, [filename], data);
      redisSet(DIR_CONST.PROGRAMS, programsDir);

      wsSend({ event: EVENTS.WATCH_PROGRAMS, payload: programsDir });

      res.status(200).send();
      break;
    }

    case EVENTS.DELETE_PROGRAM: {
      const [filename] = args;
      const programsDir = await redisGet(DIR_CONST.PROGRAMS);

      unset(programsDir, [filename]);
      redisSet(DIR_CONST.PROGRAMS, programsDir);

      wsSend({ event: EVENTS.WATCH_PROGRAMS, payload: programsDir });

      res.status(200).send();
      break;
    }

    case EVENTS.EDIT_SETTINGS: {
      const [filename, data] = args;

      if (!isPlainObject(data)) {
        console.log("invalid data", data);
        res.status(400).send();
        break;
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

      const settingsDir = await redisGet(DIR_CONST.SETTINGS);

      merge(settingsDir, { [filename]: data });
      redisSet(DIR_CONST.SETTINGS, settingsDir);

      wsSend({ event: EVENTS.WATCH_SETTINGS, payload: settingsDir });

      res.status(200).send();
      break;
    }

    case EVENTS.APP_QUIT: {
      // do nothing
      res.status(200).send();
      break;
    }

    default:
      res.status(400).send();
      break;
  }
});

const onCadenceFn = () =>
  wsSend({ event: EVENTS.WATCH_CADENCE, payload: rate.rpm });
rate.cadenceSensor.watch(onCadenceFn);

app.get("/*", (req, res) =>
  res.sendFile(path.join(__dirname, buildPath, "index.html")),
);

const server = app.listen(PORT, () => {
  console.log("Server has been started on port", PORT);
});

wsServer = new WebSocket.Server({ server });

wsServer.on("connection", () => {
  console.log("Connection is opened");
  // do nothing
});

wsServer.on("close", () => {
  console.log("Connection is closed");
  // do nothing
});
