const logUpdate = require("log-update");

const frames = ["-", "\\", "|", "/"];
let index = 0;

setInterval(() => {
  const frame = frames[(index = ++index % frames.length)];

  logUpdate(
    `
        ♥♥
   ${frame} unicorns ${frame}
        ♥♥
`,
  );
}, 80);

setInterval(() => {
  const frame = frames[(index = ++index % frames.length)];

  logUpdate(
    `
          ♥♥
     ${frame} horse ${frame}
          ♥♥
  `,
  );
}, 80);
