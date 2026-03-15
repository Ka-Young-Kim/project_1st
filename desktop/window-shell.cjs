"use strict";

const WINDOW_CHANNELS = {
  minimize: "desktop-shell:minimize",
  toggleMaximize: "desktop-shell:toggle-maximize",
  close: "desktop-shell:close",
  stateChange: "desktop-shell:state-change",
};

function getMainWindowOptions(preloadPath) {
  return {
    width: 1480,
    height: 960,
    minWidth: 1180,
    minHeight: 760,
    frame: false,
    autoHideMenuBar: true,
    backgroundColor: "#0a1222",
    title: "Finance Dashboard",
    show: false,
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: false,
      preload: preloadPath,
    },
  };
}

function getWindowStatePayload(window) {
  return {
    isDesktopApp: true,
    isMaximized: window.isMaximized(),
  };
}

module.exports = {
  WINDOW_CHANNELS,
  getMainWindowOptions,
  getWindowStatePayload,
};
