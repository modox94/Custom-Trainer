const ui = require("cliui")();
const chalk = require("chalk");

ui.div("Usage: $0 [command] [options]");

ui.div({
  text: "Options:",
  padding: [2, 0, 1, 0],
});

ui.div(
  {
    text: "-f, --file",
    width: 20,
    padding: [0, 4, 0, 4],
  },
  {
    text:
      "the file to load." +
      chalk.green("(if this description is long it wraps)."),
    width: 20,
  },
  {
    text: chalk.red("[required]"),
    align: "right",
  },
);

console.log(ui.toString());
