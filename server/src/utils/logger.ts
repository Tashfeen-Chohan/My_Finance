export enum LogLevel {
  INFO = "INFO",
  WARN = "WARN",
  ERROR = "ERROR",
  HTTP = "HTTP",
  DEBUG = "DEBUG",
}

const formatMessage = (level: LogLevel, message: string, meta?: unknown): string => {
  const timestamp = new Date().toISOString();
  const metaStr = meta ? ` | Meta: ${JSON.stringify(meta)}` : "";
  return `[${timestamp}] [${level}]: ${message}${metaStr}`;
};

export const logger = {
  info: (message: string, meta?: unknown): void => {
    console.log(formatMessage(LogLevel.INFO, message, meta));
  },
  warn: (message: string, meta?: unknown): void => {
    console.warn(formatMessage(LogLevel.WARN, message, meta));
  },
  error: (message: string, meta?: unknown): void => {
    console.error(formatMessage(LogLevel.ERROR, message, meta));
  },
  http: (message: string, meta?: unknown): void => {
    console.log(formatMessage(LogLevel.HTTP, message, meta));
  },
  debug: (message: string, meta?: unknown): void => {
    if (process.env.NODE_ENV !== "production") {
      console.log(formatMessage(LogLevel.DEBUG, message, meta));
    }
  },
};
