export {};

type DesktopShellState = {
  isDesktopApp: boolean;
  isMaximized: boolean;
};

type DesktopShellApi = DesktopShellState & {
  minimize: () => void;
  toggleMaximize: () => void;
  close: () => void;
  subscribeWindowState: (
    listener: (state: DesktopShellState) => void,
  ) => () => void;
};

declare global {
  interface Window {
    desktopShell?: DesktopShellApi;
  }
}
