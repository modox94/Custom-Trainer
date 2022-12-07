const { motor } = require("./src/hardware/motor_driver");

const fn = async () => {
  const res1 = await motor.setLevel(4);
  console.log("res1", res1);

  const res2 = await motor.setLevel(8);
  console.log("res2", res2);
};

fn();
