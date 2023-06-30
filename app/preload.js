const { ipcRenderer, contextBridge, dialog} = require("electron");
const os = require('os');
const path = require('path');

contextBridge.exposeInMainWorld('os', {
  homedir: () => os.homedir(),
});

contextBridge.exposeInMainWorld('path', {
  join: (...args) => path.join(...args),
});


contextBridge.exposeInMainWorld('ipcRenderer', {
  send: (channel, data) => ipcRenderer.send(channel, data),
  on: (channel, func) =>
    ipcRenderer.on(channel, (event, ...args) => func(...args)),
});


contextBridge.exposeInMainWorld('dialog', {
  showOpenDialog: (options) => dialog.showOpenDialog(options),
  showSaveDialog: (options) => dialog.showSaveDialog(options),
  showMessageBox: (options) => dialog.showMessageBox(options),
});

contextBridge.exposeInMainWorld('electronAPI', {
  onLoadingCall: (callback) => ipcRenderer.on('update-loading', callback)
})