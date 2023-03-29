const { app, Menu } = require("electron");

const template = [
  {
    role: "fileMenu",
  },
  {
    label: "View",
    submenu: [
      { role: "reload" },
      { role: "forceReload" },
      { type: "separator" },
      { role: "resetZoom" },
      { type: "separator" },
      { role: "togglefullscreen" },
    ],
  },
  {
    role: "help",
    submenu: [
      {
        label: "GitHub",
        click: async () => {
          const { shell } = require("electron");
          await shell.openExternal("https://github.com/modox94/Custom-Trainer");
        },
      },
    ],
  },
];

if (!app.isPackaged) {
  template[1].submenu.push({ type: "separator" }, { role: "toggleDevTools" });
}

exports.aplicationMenu = Menu.buildFromTemplate(template);
