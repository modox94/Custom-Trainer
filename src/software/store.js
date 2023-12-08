const chokidar = require("chokidar");
const { app } = require("electron");
const {
  assign,
  camelCase,
  cloneDeep,
  get,
  isEqual,
  isFunction,
  set,
  unset,
} = require("lodash");
const fs = require("node:fs");
const path = require("node:path");
const defaultTrainingPrograms = require("../../default_training_programs");
const {
  ABSOLUTE_DIR_CONST,
  DIR_CONST,
  DOT_JSON,
  ERRORS,
  FILE_CONST,
  interfaceDefault,
  peripheralDefault,
} = require("../constants/constants");
const {
  validateInterface,
  validatePeripheral,
  validateProgram,
} = require("./validators");

const DIR_CONST_ARRAY = Object.values(DIR_CONST);
const ABSOLUTE_DIR_CONST_ARRAY = Object.values(ABSOLUTE_DIR_CONST);

class Store {
  constructor() {
    this.constants = {
      userDataPath:
        app?.getPath("userData") ||
        `${process?.env?.HOME || ""}/.config/custom-trainer`,
    };

    this.callbacks = DIR_CONST_ARRAY.reduce((callbacksObj, dir) => {
      callbacksObj[dir] = [];
      return callbacksObj;
    }, {});
    this.watchers = DIR_CONST_ARRAY.reduce((watchersObj, dir) => {
      const fullPath = path.join(this.constants.userDataPath, dir);
      if (!fs.existsSync(fullPath)) {
        fs.mkdirSync(fullPath, { recursive: true });
      }
      if (watchersObj[dir]) {
        console.log("error watcher already created");
      }

      watchersObj[dir] = chokidar.watch(fullPath, { ignoreInitial: true });
      watchersObj[dir].on("add", this.onAddOrChange.bind(this, dir));
      watchersObj[dir].on("change", this.onAddOrChange.bind(this, dir));
      watchersObj[dir].on("unlink", this.onUnlink.bind(this, dir));
      return watchersObj;
    }, {});

    this.store = DIR_CONST_ARRAY.reduce((storeObj, dir) => {
      storeObj[dir] = {};
      return storeObj;
    }, {});

    if (fs.existsSync(ABSOLUTE_DIR_CONST.BOOT)) {
      const relativePath = path.relative(
        this.constants.userDataPath,
        ABSOLUTE_DIR_CONST.BOOT,
      );
      this.constants[ABSOLUTE_DIR_CONST.BOOT] = relativePath;
      try {
        this.watchers[relativePath] = chokidar.watch(relativePath, {
          ignored: path =>
            path.includes(".img") ||
            path.includes(".bin") ||
            path.includes(".elf"),
          ignorePermissionErrors: true,
          depth: 0,
        });

        this.watchers[relativePath].on(
          "add",
          this.onAddOrChange.bind(this, relativePath),
        );
        this.watchers[relativePath].on(
          "change",
          this.onAddOrChange.bind(this, relativePath),
        );
        this.watchers[relativePath].on(
          "unlink",
          this.onUnlink.bind(this, relativePath),
        );
      } catch (error) {
        console.log("watch err", error);
      }
      this.callbacks[relativePath] = [];
    } else {
      this.constants[ABSOLUTE_DIR_CONST.BOOT] = ABSOLUTE_DIR_CONST.BOOT;
      this.store[ABSOLUTE_DIR_CONST.BOOT] = {
        [FILE_CONST.CONFIG]: ERRORS.BOOT_CONFIG_NOT_EXIST,
      };
      this.watchers[ABSOLUTE_DIR_CONST.BOOT] = ERRORS.BOOT_CONFIG_NOT_EXIST;
      this.callbacks[ABSOLUTE_DIR_CONST.BOOT] = [];
    }

    this.initialize();
  }

  initialize() {
    const tempStore = {};

    // Programs
    const programsFullPath = path.join(
      this.constants.userDataPath,
      DIR_CONST.PROGRAMS,
    );
    const programsDir = fs.readdirSync(programsFullPath, {
      withFileTypes: true,
    });

    programsDir.forEach(programFile => {
      if (programFile.isDirectory()) {
        return console.log("error unexpected folder");
      } else if (programFile.isFile()) {
        const pathEl = path.join(programsFullPath, programFile.name);
        const programObj = JSON.parse(
          fs.readFileSync(pathEl, { encoding: "utf-8" }),
        );
        if (validateProgram(programObj)) {
          set(tempStore, [DIR_CONST.PROGRAMS, programFile.name], programObj);
        }
      }
    });

    defaultTrainingPrograms.forEach(defaultProgram => {
      const equalKeys = ["title", "maxResistanceLevel", "steps"];

      for (const programFile in tempStore[DIR_CONST.PROGRAMS]) {
        let equalKeyCounter = 0;
        for (const key of equalKeys) {
          const isEqualKey = isEqual(
            get(tempStore, [DIR_CONST.PROGRAMS, programFile, key]),
            get(defaultProgram, [key]),
          );
          if (isEqualKey) {
            equalKeyCounter += 1;
          }
        }

        if (equalKeyCounter === equalKeys.length) {
          console.log("total equal");
          return;
        }
      }

      let filename = `${camelCase(defaultProgram.title)}${DOT_JSON}`;
      let iterator = 0;
      while (get(tempStore, [DIR_CONST.PROGRAMS, filename]) && iterator < 100) {
        iterator += 1;
        filename = `${camelCase(
          defaultProgram.title,
        )}_(${iterator})${DOT_JSON}`;
      }

      if (get(tempStore, [DIR_CONST.PROGRAMS, filename])) {
        return console.log("error cant save default program");
      }

      this.create(DIR_CONST.PROGRAMS, filename, defaultProgram);
      set(tempStore, [DIR_CONST.PROGRAMS, filename], defaultProgram);
    });

    // Settings
    const settingsFullPath = path.join(
      this.constants.userDataPath,
      DIR_CONST.SETTINGS,
    );
    const settingsDir = fs.readdirSync(settingsFullPath, {
      withFileTypes: true,
    });

    settingsDir.forEach(settingsFile => {
      if (settingsFile.isDirectory()) {
        return console.log("error unexpected folder");
      } else if (settingsFile.isFile()) {
        const pathEl = path.join(settingsFullPath, settingsFile.name);
        const settingObj = JSON.parse(
          fs.readFileSync(pathEl, { encoding: "utf-8" }),
        );
        set(tempStore, [DIR_CONST.SETTINGS, settingsFile.name], settingObj);
      }
    });

    const tempStoreSI = get(tempStore, [
      DIR_CONST.SETTINGS,
      FILE_CONST.INTERFACE,
    ]);
    if (!tempStoreSI) {
      this.create(DIR_CONST.SETTINGS, FILE_CONST.INTERFACE, interfaceDefault);
      set(
        tempStore,
        [DIR_CONST.SETTINGS, FILE_CONST.INTERFACE],
        interfaceDefault,
      );
    } else if (!validateInterface(tempStoreSI)) {
      this.edit(DIR_CONST.SETTINGS, FILE_CONST.INTERFACE, interfaceDefault);
      set(
        tempStore,
        [DIR_CONST.SETTINGS, FILE_CONST.INTERFACE],
        interfaceDefault,
      );
    }

    const tempStoreSP = get(tempStore, [
      DIR_CONST.SETTINGS,
      FILE_CONST.PERIPHERAL,
    ]);
    if (!tempStoreSP) {
      this.create(DIR_CONST.SETTINGS, FILE_CONST.PERIPHERAL, peripheralDefault);
      set(
        tempStore,
        [DIR_CONST.SETTINGS, FILE_CONST.PERIPHERAL],
        peripheralDefault,
      );
    } else if (!validatePeripheral(tempStoreSP)) {
      this.edit(DIR_CONST.SETTINGS, FILE_CONST.PERIPHERAL, peripheralDefault);
      set(
        tempStore,
        [DIR_CONST.SETTINGS, FILE_CONST.PERIPHERAL],
        peripheralDefault,
      );
    }

    this.store = tempStore;
  }

  onAddOrChange(dir, pathValue) {
    const { base, ext } = path.parse(pathValue) || {};

    try {
      let fileData = fs.readFileSync(pathValue, { encoding: "utf-8" });
      if (ext.toLowerCase() === DOT_JSON) {
        fileData = JSON.parse(fileData);
      }
      set(this.store, [dir, base], fileData);
      this.callbacks[dir].forEach(cb => {
        if (isFunction(cb)) {
          cb(this.store[dir]);
        } else {
          console.log("error bad store callback");
        }
      });
    } catch (error) {
      console.log("onAddOrChange error", pathValue);
      // console.log(error);
    }
  }

  onUnlink(dir, pathValue) {
    const { base } = path.parse(pathValue) || {};

    if (get(this.store, [dir, base])) {
      unset(this.store, [dir, base]);
      this.callbacks[dir].forEach(cb => {
        if (isFunction(cb)) {
          cb(this.store[dir]);
        } else {
          console.log("error bad store callback");
        }
      });
    }
  }

  watch(dir, cb) {
    const allConsts = [...DIR_CONST_ARRAY];
    ABSOLUTE_DIR_CONST_ARRAY.map(el => allConsts.push(this.constants[el]));
    if (!allConsts.includes(dir)) {
      console.log("error wrong dir");
      return;
    }
    if (!isFunction(cb)) {
      console.log("error bad store callback");
      return;
    }

    this.callbacks[dir].push(cb);
    cb(this.store[dir]);

    return this.unwatch.bind(this, dir, cb);
  }

  unwatch(dir, cb) {
    if (!DIR_CONST_ARRAY.includes(dir)) {
      console.log("error wrong dir");
      return;
    }
    if (!isFunction(cb)) {
      console.log("error bad store callback");
      return;
    }

    this.callbacks[dir] = this.callbacks[dir].filter(cbEl => {
      if (cbEl === cb) {
        console.log("successfull unwatch");
        return false;
      }
      return true;
    });
  }

  isExist(dir, filename) {
    const fullPath = path.join(this.constants.userDataPath, dir, filename);
    const isExist = fs.existsSync(fullPath);

    return isExist;
  }

  isTitleAvailable(dir, title) {
    if (dir !== DIR_CONST.PROGRAMS) {
      console.log("error titles only in programs dir");
      return false;
    }

    const findResult = Object.values(this.store[dir]).find(
      program => program.title === title,
    );

    return !findResult;
  }

  create(dir, filename, data) {
    if (!DIR_CONST_ARRAY.includes(dir)) {
      console.log("error wrong dir");
      return;
    }

    const isExist = this.isExist(dir, filename);
    if (isExist) {
      console.log("error already exist");
      return;
    }

    const fullPath = path.join(this.constants.userDataPath, dir, filename);
    fs.writeFileSync(fullPath, JSON.stringify(data));
  }

  createProgram(data) {
    let filename = `${camelCase(data.title)}${DOT_JSON}`;
    let iterator = 0;
    while (get(this.store, [DIR_CONST.PROGRAMS, filename]) && iterator < 100) {
      iterator += 1;
      filename = `${camelCase(data.title)}_(${iterator})${DOT_JSON}`;
    }

    if (get(this.store, [DIR_CONST.PROGRAMS, filename])) {
      console.log("error cant save program");
      return;
    }

    this.create(DIR_CONST.PROGRAMS, filename, data);
  }

  edit(dir, filename, data) {
    if (!DIR_CONST_ARRAY.includes(dir)) {
      console.log("error wrong dir");
      return;
    }

    const isExist = this.isExist(dir, filename);
    if (!isExist) {
      console.log("error file not exist");
      return;
    }

    const fullPath = path.join(this.constants.userDataPath, dir, filename);
    fs.writeFileSync(fullPath, JSON.stringify(data));
  }

  editProgram(filename, data) {
    this.edit(DIR_CONST.PROGRAMS, filename, data);
  }

  editSettings(filename, data) {
    if (Object.values(FILE_CONST).includes(filename)) {
      const newData = cloneDeep(
        get(this.store, [DIR_CONST.SETTINGS, filename], {}),
      );
      assign(newData, data);

      this.edit(DIR_CONST.SETTINGS, filename, newData);
    } else {
      console.log("error invalid args");
      console.log("filename", filename);
      console.log("data", data);
    }
  }

  delete(dir, filename) {
    if (!DIR_CONST_ARRAY.includes(dir)) {
      console.log("error wrong dir");
      return;
    }

    const isExist = this.isExist(dir, filename);
    if (!isExist) {
      console.log("error file not exist");
      return;
    }

    const fullPath = path.join(this.constants.userDataPath, dir, filename);
    fs.unlinkSync(fullPath);
  }
}

module.exports = Store;
