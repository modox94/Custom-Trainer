const { app } = require("electron");
const path = require("node:path");
const fs = require("node:fs");
const {
  get,
  set,
  camelCase,
  isEqual,
  isFunction,
  unset,
  cloneDeep,
} = require("lodash");
const chokidar = require("chokidar");
const defaultTrainingPrograms = require("../../default_training_programs");
const {
  LANGS_CODES,
  DIR_CONST,
  FILE_CONST,
} = require("../constants/constants");

const interfaceDefault = {
  lang: LANGS_CODES.en,
};

const DIR_CONST_ARRAY = Object.values(DIR_CONST);

class Store {
  constructor() {
    this.userDataPath = app.getPath("userData");

    this.callbacks = DIR_CONST_ARRAY.reduce((callbacksObj, dir) => {
      callbacksObj[dir] = [];
      return callbacksObj;
    }, {});
    this.watchers = DIR_CONST_ARRAY.reduce((watchersObj, dir) => {
      const fullPath = path.join(this.userDataPath, dir);
      const isExist = fs.existsSync(fullPath);
      if (!isExist) {
        fs.mkdirSync(fullPath, { recursive: true });
      }
      if (watchersObj[dir]) {
        console.log("error watcher already created");
      }

      watchersObj[dir] = chokidar.watch(fullPath);
      watchersObj[dir].on("add", this.onAddOrChange.bind(this, dir));
      watchersObj[dir].on("change", this.onAddOrChange.bind(this, dir));
      watchersObj[dir].on("unlink", this.onUnlink.bind(this, dir));
      return watchersObj;
    }, {});

    this.store = DIR_CONST_ARRAY.reduce((storeObj, dir) => {
      storeObj[dir] = {};
      return storeObj;
    }, {});

    this.initialize();
  }

  initialize() {
    const tempStore = {};

    // Programs
    const programsFullPath = path.join(this.userDataPath, DIR_CONST.PROGRAMS);
    const programsDir = fs.readdirSync(programsFullPath, {
      withFileTypes: true,
    });

    programsDir.forEach(programFile => {
      if (programFile.isDirectory()) {
        return console.log("error unexpected folder");
      } else if (programFile.isFile()) {
        const pathEl = path.join(programsFullPath, programFile.name);
        const programObj = JSON.parse(fs.readFileSync(pathEl));
        set(tempStore, [DIR_CONST.PROGRAMS, programFile.name], programObj);
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

      let filename = `${camelCase(defaultProgram.title)}.json`;
      let iterator = 0;
      while (get(tempStore, [DIR_CONST.PROGRAMS, filename]) && iterator < 100) {
        iterator += 1;
        filename = `${camelCase(defaultProgram.title)}_(${iterator}).json`;
      }

      if (get(tempStore, [DIR_CONST.PROGRAMS, filename])) {
        return console.log("error cant save default program");
      }

      this.create(DIR_CONST.PROGRAMS, filename, defaultProgram);
    });

    // Settings
    const settingsFullPath = path.join(this.userDataPath, DIR_CONST.SETTINGS);
    const settingsDir = fs.readdirSync(settingsFullPath, {
      withFileTypes: true,
    });

    settingsDir.forEach(programFile => {
      if (programFile.isDirectory()) {
        return console.log("error unexpected folder");
      } else if (programFile.isFile()) {
        const pathEl = path.join(settingsFullPath, programFile.name);
        const programObj = JSON.parse(fs.readFileSync(pathEl));
        set(tempStore, [DIR_CONST.SETTINGS, programFile.name], programObj);
      }
    });

    if (!get(tempStore, [DIR_CONST.SETTINGS, FILE_CONST.INTERFACE])) {
      this.create(DIR_CONST.SETTINGS, FILE_CONST.INTERFACE, interfaceDefault);
    }

    if (!get(tempStore, [DIR_CONST.SETTINGS, FILE_CONST.PERIPHERAL])) {
      // TODO
    }
  }

  onAddOrChange(dir, pathValue) {
    const { base } = path.parse(pathValue) || {};

    try {
      const programObj = JSON.parse(fs.readFileSync(pathValue));
      set(this.store, [dir, base], programObj);
      this.callbacks[dir].forEach(cb => {
        if (isFunction(cb)) {
          cb(this.store[dir]);
        } else {
          console.log("error bad store callback");
        }
      });
    } catch (error) {
      console.log(error);
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
    if (!DIR_CONST_ARRAY.includes(dir)) {
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
    const fullPath = path.join(this.userDataPath, dir, filename);
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

    const fullPath = path.join(this.userDataPath, dir, filename);
    fs.writeFileSync(fullPath, JSON.stringify(data));
  }

  createProgram(data) {
    let filename = `${camelCase(data.title)}.json`;
    let iterator = 0;
    while (get(this.store, [DIR_CONST.PROGRAMS, filename]) && iterator < 100) {
      iterator += 1;
      filename = `${camelCase(data.title)}_(${iterator}).json`;
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

    const fullPath = path.join(this.userDataPath, dir, filename);
    fs.writeFileSync(fullPath, JSON.stringify(data));
  }

  editProgram(filename, data) {
    this.edit(DIR_CONST.PROGRAMS, filename, data);
  }

  editSettings(filename, field, value) {
    if (Object.values(FILE_CONST).includes(filename)) {
      const newData = cloneDeep(
        get(this.store, [DIR_CONST.SETTINGS, filename], {}),
      );
      set(newData, [field], value);
      this.edit(DIR_CONST.SETTINGS, filename, newData);
    } else {
      console.log("error invalid args");
      console.log("filename", filename);
      console.log("field", field);
      console.log("value", value);
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

    const fullPath = path.join(this.userDataPath, dir, filename);
    fs.unlinkSync(fullPath);
  }
}

module.exports = Store;
