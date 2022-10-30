const mcpadc = require("mcp-spi-adc");

const tempSensor = mcpadc.open(5, err => {
  if (err) console.log("err", err);

  setInterval(_ => {
    tempSensor.read((err, reading) => {
      if (err) console.log("err", err);

      console.log("data", reading.value);
    });
  }, 1000);
});
