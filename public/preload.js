const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("versions", {
  node: process.versions.node,
  chrome: process.versions.chrome,
  electron: process.versions.electron,
});

contextBridge.exposeInMainWorld("app", {
  invoke: ipcRenderer.invoke,
});

contextBridge.exposeInMainWorld('icheonlib', {
  test: (arg1) => {
    ipcRenderer.send('test', arg1)

  },
  saveXls: (data) => {
    ipcRenderer.send('save-xls', data)
  }
})