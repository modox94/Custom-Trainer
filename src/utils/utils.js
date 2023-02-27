const Promise = require("bluebird");
const { isFunction } = require("lodash");

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
