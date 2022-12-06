const { app } = require("electron");
const path = require("node:path");
const fs = require("node:fs");
const { get, set } = require("lodash");

const DIR_CONST = {
  SETTINGS: "settings",
  EXERCISES: "exercises",
  PROGRAMS: "programs",
};

const parseDataFile = filePath => {
  const isValid = fs.existsSync(filePath);

  if (!isValid) {
    try {
      fs.writeFileSync(filePath, JSON.stringify({}));
    } catch (error) {
      console.log("Invalid path, can't write empty file", error);
      return {};
    }
  }

  try {
    return JSON.parse(fs.readFileSync(filePath));
  } catch (error) {
    console.log("Read file error", error);
    return {};
  }
};

class StoreDir {
  constructor() {
    this.userDataPath = app.getPath("userData");
  }

  read(pathArray = [], fileName = "") {
    console.log("pathArray", pathArray);
    const fullPath = path.join(this.userDataPath, ...pathArray, fileName);
    const isValid = fs.existsSync(fullPath);

    console.log("fullPath", fullPath);

    if (!isValid) {
      const { dir, base, ext } = path.parse(fullPath) || {};

      console.log("dir", dir);
      console.log("base", base);

      if (ext) {
        try {
          fs.mkdirSync(dir, { recursive: true });
        } catch (error) {
          console.log(error);
        }

        return new StoreFile({ pathArray, fileName });
      } else {
        try {
          fs.mkdirSync(fullPath, { recursive: true });
        } catch (error) {
          console.log(error);
        }

        return fs.readdirSync(fullPath);
      }
    }

    const stat = fs.statSync(fullPath);
    const isDirectory = stat.isDirectory();
    const isFile = stat.isFile();

    if (isDirectory) {
      return fs.readdirSync(fullPath);
    }

    if (isFile) {
      const { dir, base } = path.parse(fullPath) || {};
      return new StoreFile({ pathArray, fileName });
    }

    return { error: "Invalid path" };
  }
}

class StoreFile {
  constructor(opts) {
    const userDataPath = app.getPath("userData");
    this.fileName = get(opts, ["fileName"]);
    this.pathArray = get(opts, ["pathArray"], []);

    if (!this.fileName) {
      this.error = "Invalid file name";
      this.path = null;
      this.data = null;
      throw new Error(this.error);
    } else {
      this.path = path.join(userDataPath, ...this.pathArray, this.fileName);

      this.data = parseDataFile(this.path);
    }
  }

  get(keyPath = []) {
    if (this.error) {
      throw new Error(this.error);
    }

    return get(this.data, keyPath);
  }

  set(keyPath = [], val) {
    if (this.error) {
      throw new Error(this.error);
    }

    set(this.data, keyPath, val);
    fs.writeFileSync(this.path, JSON.stringify(this.data));
    return this.data;
  }
}

exports.DIR_CONST = DIR_CONST;
exports.StoreDir = StoreDir;
exports.StoreFile = StoreFile;
