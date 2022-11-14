const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electron", {
  ipcRenderer: {
    on(channel, func) {
      const subscription = (_event, ...args) => func(...args);
      ipcRenderer.on(channel, subscription);

      return () => {
        ipcRenderer.removeListener(channel, subscription);
      };
    },
    once(channel, func) {
      ipcRenderer.once(channel, (_event, ...args) => func(...args));
    },
    removeAllListeners(channel) {
      ipcRenderer.removeAllListeners(channel);
    },
    send(channel, ...args) {
      ipcRenderer.send(channel, ...args);
    },
    async invoke(channel, ...args) {
      return await ipcRenderer.invoke(channel, ...args);
    },
    sendSync(channel, ...args) {
      ipcRenderer.sendSync(channel, ...args);
    },
    postMessage(channel, message, transfer) {
      ipcRenderer.postMessage(channel, message, transfer);
    },
    sendTo(webContentsId, channel, ...args) {
      ipcRenderer.sendTo(webContentsId, channel, ...args);
    },
    sendToHost(channel, ...args) {
      ipcRenderer.sendToHost(channel, ...args);
    },
  },
});
