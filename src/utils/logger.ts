import { createLogger, transports, format } from "winston";

interface LogLevels {
  [key: string]: number;
}

const logLevels: LogLevels = {
  fatal: 0,
  error: 1,
  warn: 2,
  info: 3,
  debug: 4,
  trace: 5,
};

interface LogLevelColors {
  [key: string]: string;
}

const colorizeLevel = (level: string, colors: LogLevelColors) => {
  switch (level) {
    case 'fatal':
    case 'error':
    case 'warn':
    case 'info':
    case 'debug':
    case 'trace':
      return colors[level] ?? '\x1b[0m'; 
    default:
      return '\x1b[0m'; 
  }
};

const levelColors: LogLevelColors = {
  fatal: '\x1b[31m', // Red
  error: '\x1b[31m', // Red
  warn: '\x1b[33m', // Yellow
  info: '\x1b[36m', // Cyan
  debug: '\x1b[35m', // Magenta
  trace: '\x1b[32m', // Green
};

export const logger = createLogger({
  levels: logLevels,
  transports: [
    new transports.Console({
      format: format.combine(
        format.timestamp(),
        format.printf(({ level, message }) => {
          let emoji = '';
          switch (level) {
            case 'fatal':
              emoji = '💀';
              break;
            case 'error':
              emoji = '❌';
              break;
            case 'warn':
              emoji = '⚠️';
              break;
            case 'info':
              emoji = '👀';
              break;
            case 'debug':
              emoji = '🔍';
              break;
            case 'trace':
              emoji = '🔎';
              break;
            default:
              emoji = '';
          }
          const color = colorizeLevel(level, levelColors);
          return `${color}${emoji} [${level.toUpperCase()}]\x1b[0m: ${message}\x1b[0m`; 
        })
      )
    })
  ]
});
