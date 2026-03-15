import { createRequire } from "node:module";

import { describe, expect, it } from "vitest";

const require = createRequire(import.meta.url);
const {
  WINDOW_CHANNELS,
  getMainWindowOptions,
  getWindowStatePayload,
} = require("../../desktop/window-shell.cjs");

describe("desktop window shell helpers", () => {
  it("builds frameless main window options", () => {
    const options = getMainWindowOptions("/tmp/preload.cjs");

    expect(options.width).toBe(1480);
    expect(options.height).toBe(960);
    expect(options.minWidth).toBe(1180);
    expect(options.minHeight).toBe(760);
    expect(options.frame).toBe(false);
    expect(options.webPreferences.preload).toBe("/tmp/preload.cjs");
  });

  it("creates desktop window state payload", () => {
    const payload = getWindowStatePayload({
      isMaximized() {
        return true;
      },
    });

    expect(payload).toEqual({
      isDesktopApp: true,
      isMaximized: true,
    });
  });

  it("defines stable IPC channels", () => {
    expect(WINDOW_CHANNELS).toMatchObject({
      minimize: "desktop-shell:minimize",
      toggleMaximize: "desktop-shell:toggle-maximize",
      close: "desktop-shell:close",
      stateChange: "desktop-shell:state-change",
    });
  });
});
