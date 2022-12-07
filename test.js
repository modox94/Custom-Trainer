const { motor } = require("./src/hardware/motor_driver");

const fn = async () => {
  console.log("start");
  const res1 = await motor.setLevel(4);
  console.log("res1", res1);
  console.log("middle");
  const res2 = await motor.setLevel(8);
  console.log("res2", res2);
  console.log("finish");
};

fn();
