const { app } = require("electron");
const path = require("node:path");
const fs = require("node:fs");
const { get, set, camelCase, isEqual, isFunction, unset } = require("lodash");
const chokidar = require("chokidar");
const defaultTrainingPrograms = require("../../default_training_programs");

const DIR_CONST = {
  SETTINGS: "settings",
  EXERCISES: "exercises",
  PROGRAMS: "programs",
};

const DIR_CONST_ARRAY = Object.values(DIR_CONST);

class Store {
  constructor() {
    this.userDataPath = app.getPath("userData");
    console.log("this.userDataPath", this.userDataPath);

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
    const fullPath = path.join(this.userDataPath, DIR_CONST.PROGRAMS);
    const programsDir = fs.readdirSync(fullPath, { withFileTypes: true });
    const tempStore = {};

    programsDir.forEach(programFile => {
      if (programFile.isDirectory()) {
        return console.log("error unexpected folder");
      } else if (programFile.isFile()) {
        const pathEl = path.join(fullPath, programFile.name);
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

      let fileName = `${camelCase(defaultProgram.title)}.json`;
      let iterator = 0;
      while (tempStore[DIR_CONST.PROGRAMS][fileName] && iterator < 100) {
        iterator += 1;
        fileName = `${camelCase(defaultProgram.title)}_(${iterator}).json`;
      }

      if (tempStore[DIR_CONST.PROGRAMS][fileName]) {
        return console.log("error cant save default program");
      }

      const filePath = path.join(fullPath, fileName);
      console.log("fileName", fileName);
      console.log("writeFileSync", filePath);
      fs.writeFileSync(filePath, JSON.stringify(defaultProgram));
      set(tempStore, [DIR_CONST.PROGRAMS, filePath], defaultProgram);
    });
  }

  onAddOrChange(dir, pathValue) {
    console.log("onAddOrChange");
    console.log("pathValue", pathValue);
    console.log("dir", dir);

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

    console.log("this.store", this.store);
  }

  onUnlink(dir, pathValue) {
    console.log("onUnlink");
    console.log("pathValue", pathValue);
    console.log("dir", dir);

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

    console.log("this.store", this.store);
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

exports.DIR_CONST = DIR_CONST;
exports.Store = Store;
