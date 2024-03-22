import { createLogger, transports, format } from "winston";

interface LogLevelInfo {
    fatal: LogLevelData;
    error: LogLevelData;
    warn: LogLevelData;
    info: LogLevelData;
    debug: LogLevelData;
    trace: LogLevelData;
	[key: string]: LogLevelData;
}

interface LogLevelData {
    color: string;
    emoji: string;
}

const logLevels: LogLevelInfo = {
	fatal: {
		color: "\x1b[31m",
		emoji: '💀'
	},
	error: {
		color: "\x1b[31m",
		emoji: '❌'
	},
	warn: {
		color: "\x1b[33m",
		emoji: '⚠️'
	},
	info: {
		color: "\x1b[36m",
		emoji: '👀'
	},
	debug: {
		color: "\x1b[35m",
		emoji: '🔍'
	},
	trace: {
		color: "\x1b[32m",
		emoji: '🔍'
	},
}

interface TransformableInfo {
	level: string;
	message: string;
}

export const logger = createLogger({
	transports: [
		new transports.Console({
			format: format.combine(
				format.timestamp(),
				format.printf(({ level, message }: TransformableInfo) => {
					if (!(level in logLevels))
						throw new Error(`Invalid log level: ${level}`);

					return `${logLevels[level].color}${logLevels[level].emoji}`
								+ ` [${level.toUpperCase()}]\x1b[0m: ${message}\x1b[0m`;
				}
				)
			)
		})
	]
});
