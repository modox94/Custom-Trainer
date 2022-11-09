const readline = require("node:readline");
const { stdin: input, stdout: output } = require("node:process");
const fs = require("fs");
const path = require("node:path");
const logUpdate = require("log-update");
const ui = require("cliui")();
const chalk = require("chalk");
const { get, set, round } = require("lodash");
const { motor } = require("./motor_driver");
const { sleep } = require("./utils");
const { cadenceSignal, counter } = require("./cadence_sensor.js");

// const { getTimecodes, Frequency } = require("./utils.js");

// const { frq, pl, sensorSignals } = getTimecodes();

// const testAr = sensorSignals.slice(4, 11);

// const coef = 60000 / (testAr[testAr.length - 1] - testAr[0]);
// const rpm = (testAr.length * coef) / 2;

// console.log('rpm', rpm);

// const frqEl = new Frequency({ magnetsCount: 2 });

// sensorSignals.forEach(el => {
//   console.log(frqEl.inc(el.getMilliseconds()));
// });

// for (let idx = 1; idx < sensorSignals.length; idx++) {
//   const prevDate = sensorSignals[idx - 1];
//   const currDate = sensorSignals[idx];

//   const duration = (currDate - prevDate) / 60000;
//   const distance = 0.5;
//   const result = distance / duration;

//   console.log(result);
// }

const temp = [];
let fileName = "";
const rlOnFn = inputRaw => {
  const input = inputRaw.trim();
  const value = Number(String(input).trim());

  if (temp.length === 0 && !fileName) {
    fileName = input;
    console.log("Вводите значения нагрузки и требуемого каденса");
    console.log("Нагрузка: ");
    return;
  }

  if (input === "finish") {
    const filePath = path.resolve(".", "training_programs", `${fileName}.json`);
    fs.writeFileSync(filePath, JSON.stringify(temp));

    temp.length = 0;
    fileName = "";

    console.log("Программа сохранена.");
    console.log("Введите название программы которую хотите создать.");
    return;
  }

  if (Number.isNaN(value) || value <= 0) {
    return console.log("invalid value");
  }

  const length = temp.length;
  let lastIdx = length - 1;
  if (
    length === 0 ||
    (temp[lastIdx].resistanceLevel && temp[lastIdx].targetRpm)
  ) {
    temp.push({ resistanceLevel: undefined, targetRpm: undefined });
    lastIdx = temp.length - 1;
  }

  if (!temp[lastIdx].resistanceLevel) {
    temp[lastIdx].resistanceLevel = Number(input);
    console.log("Каденс: ");
  } else {
    temp[lastIdx].targetRpm = Number(input);
    const time = String(lastIdx + 1);
    console.log(
      `---------------------${
        time.length > 1 ? "" : "-"
      }${time}:00----------------------`,
    );
    console.log("Нагрузка: ");
  }
};

const createProgramm = () => {
  const rl = readline.createInterface({ input, output });

  console.log("Введите название программы которую хотите создать.");

  rl.prompt();
  rl.on("line", rlOnFn).on("close", () => console.log("readline closed"));
};

// createProgramm();

// motor.initialize();

const checkSetLevel = () => {
  const rl = readline.createInterface({ input, output });

  rl.prompt();
  rl.on("line", async inputRaw => {
    const input = inputRaw.trim();
    const value = Number(String(input).trim());

    if (Number.isNaN(value) || value <= 0) {
      if (input === "g") {
        return console.log(await motor.readPosition());
      }

      if (input.startsWith("c")) {
        let loops = Number(input.slice(1).trim());

        if (Number.isNaN(loops) || loops <= 0) {
          loops = 1;
        }
        return console.log(await motor.calibration(loops));
      }

      return console.log("invalid value");
    }

    motor.setLevel(value);
  }).on("close", () => {
    motor.stop();
    console.log("readline closed");
  });
};

// checkSetLevel();

const startProgramm = () => {
  const rl = readline.createInterface({ input, output });
  const dir = fs.readdirSync("./training_programs");

  console.log("Выберете номер программы для запуска.");
  rl.prompt();
  rl.on("line", async inputRaw => {
    const input = inputRaw.trim();
    const value = Number(String(input).trim());

    if (Number.isNaN(value) || value <= 0) {
      return console.log("invalid value");
    }

    if (!dir[value - 1]) {
      return console.log("Нет такой программы");
    }

    const programmRaw = fs.readFileSync(
      `./training_programs/${dir[value - 1]}`,
      {
        encoding: "utf-8",
      },
    );
    const programm = JSON.parse(programmRaw);

    const endTime = Date.now() + programmRaw.length * 60000;

    const getRemainingTime = () => {
      const remainingDate = new Date(endTime - Date.now());

      return `${remainingDate.getMinutes()}:${remainingDate.getSeconds()}`;
    };

    const consoleOutput = [
      [
        {
          text: "Времени осталось: ",
          align: "center",
        },
        {
          text: getRemainingTime(),
          align: "center",
        },
      ],
      [
        {
          text: "Нагрузка: ",
          align: "center",
        },
        {
          text: "",
          align: "center",
        },
      ],
      [
        {
          text: "Требуемый RPM",
          align: "center",
        },
        {
          text: "Реальный RPM",
          align: "center",
        },
      ],
      [
        {
          text: "",
          align: "center",
        },
        {
          text: "",
          align: "center",
        },
      ],
    ];
    const updateConsoleOut = (...args) => set(consoleOutput, ...args);

    setInterval(() => {
      const rpmCur = round(counter.rpm);
      const rpmTar = get(consoleOutput, [2, 0, "text"]);
      let rpmCurCha = "";
      if (rpmCur > rpmTar + 10 || rpmCur < rpmTar - 10) {
        rpmCurCha = chalk.red(rpmCur);
      } else {
        rpmCurCha = chalk.green(rpmCur);
      }

      updateConsoleOut([3, 1, "text"], String(rpmCurCha));
      updateConsoleOut([0, 1, "text"], getRemainingTime());

      ui.resetOutput();

      for (const divArg of consoleOutput) {
        ui.div(...divArg);
      }

      logUpdate(ui.toString());
    }, 100);

    for (let index = 0; index < programm.length; index++) {
      const { resistanceLevel, targetRpm } = programm[index];
      motor.setLevel(resistanceLevel);
      // console.log("---------------------------");
      // console.log("targetRpm", targetRpm);

      updateConsoleOut([1, 1, "text"], String(resistanceLevel));
      updateConsoleOut([3, 0, "text"], String(targetRpm));

      await sleep(60000);
    }
  }).on("close", () => {
    motor.stop();
    console.log("readline closed");
  });
};

startProgramm();
