"use strict";

const { contextBridge, ipcRenderer } = require("electron");

const { WINDOW_CHANNELS } = require("./window-shell.cjs");

contextBridge.exposeInMainWorld("desktopShell", {
  isDesktopApp: true,
  isMaximized: false,
  minimize() {
    ipcRenderer.send(WINDOW_CHANNELS.minimize);
  },
  toggleMaximize() {
    ipcRenderer.send(WINDOW_CHANNELS.toggleMaximize);
  },
  close() {
    ipcRenderer.send(WINDOW_CHANNELS.close);
  },
  subscribeWindowState(listener) {
    if (typeof listener !== "function") {
      return () => {};
    }

    const handleStateChange = (_event, payload) => {
      listener(payload);
    };

    ipcRenderer.on(WINDOW_CHANNELS.stateChange, handleStateChange);
    ipcRenderer
      .invoke(WINDOW_CHANNELS.stateChange)
      .then((payload) => {
        listener(payload);
      })
      .catch(() => {});

    return () => {
      ipcRenderer.removeListener(WINDOW_CHANNELS.stateChange, handleStateChange);
    };
  },
});
