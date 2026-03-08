export const logger = {
  info(message: string, meta?: unknown) {
    console.info(`[app] ${message}`, meta ?? "");
  },
  warn(message: string, meta?: unknown) {
    console.warn(`[app] ${message}`, meta ?? "");
  },
  error(message: string, meta?: unknown) {
    console.error(`[app] ${message}`, meta ?? "");
  },
};
