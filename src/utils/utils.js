const Promise = require("bluebird");
const { isFunction, isString, isUndefined } = require("lodash");
const {
  LINE_FEED,
  HASH_SIGN,
  BOOT_CONFIG_OPT,
  ERRORS,
} = require("../constants/constants");

Promise.config({ cancellation: true });

exports.Promise = Promise;

// TODO add onCancel
exports.sleepCb = (cb, delay = 1000) =>
  new Promise(resolve => {
    setTimeout(() => {
      resolve();
      cb();
    }, delay);
  });

exports.getIsCancelledFn = localAction => () => {
  if (isFunction(localAction?.isCancelled) && localAction.isCancelled()) {
    console.log("canceled");
    return true;
  }

  return false;
};

exports.convertConfigToObj = configStr => {
  const configObj = {};

  if (isString(configStr)) {
    const configAr = configStr.split(LINE_FEED);

    for (const strRaw of configAr) {
      if (!strRaw) {
        continue;
      }

      const str = strRaw.trim();

      if (!str || str.startsWith(HASH_SIGN)) {
        continue;
      }

      const key = [BOOT_CONFIG_OPT.SPI, BOOT_CONFIG_OPT.LCD_ROTATE].find(el =>
        str.includes(el),
      );

      if (!isUndefined(key)) {
        configObj[key] = str;
      }
    }

    for (const key in configObj) {
      if (Object.hasOwnProperty.call(configObj, key)) {
        let valueRaw = configObj[key];

        switch (key) {
          case BOOT_CONFIG_OPT.LCD_ROTATE:
          case BOOT_CONFIG_OPT.SPI: {
            const re = RegExp(`(${BOOT_CONFIG_OPT.DTPARAM}=)?${key}=(.+)`);

            const res = valueRaw.match(re);
            const [, , value] = res || [];
            configObj[key] = isUndefined(value)
              ? ERRORS.BOOT_CONFIG_INVALID_ARG
              : value;

            break;
          }

          default:
            break;
        }
      }
    }
  }

  return configObj;
};

exports.commentConfigOpt = (configStr, optKey) => {
  let newConfStr = "";

  if (isString(configStr)) {
    const configAr = configStr.split(LINE_FEED);

    for (let idx = 0; idx < configAr.length; idx++) {
      const str = (configAr[idx] || "").trim();
      if (!str || str.startsWith(HASH_SIGN)) {
        continue;
      }
      if (str.includes(optKey)) {
        configAr[idx] = `${HASH_SIGN}${configAr[idx]}`;
      }
    }

    newConfStr = configAr.join(LINE_FEED);
  }

  return newConfStr;
};
