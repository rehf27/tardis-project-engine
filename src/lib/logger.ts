import * as winston from 'winston';

const { createLogger, transports, format } = winston;
const { combine, colorize, printf, json } = format;

const newLogger = (logLabel = '') => {
	const customFormat = printf(msg => {
		const { timestamp, label, level, message, ...logObject } = msg;

		return `[${msg.timestamp}] ${msg.label} ${msg.level}: ${message} ${JSON.stringify(logObject, null, 2)}`;
	});

	const isLocal = !process.env.NODE_ENV || process.env.NODE_ENV === 'local';
	const transportsOpt = isLocal
			? [new transports.Console({ format:  combine(colorize(), customFormat) })]
			: [new transports.Console({ format: json() })];
	const formatOpts = isLocal
			? combine(format.label({ label: logLabel }), format.timestamp(), customFormat)
			: combine(format.label({ label: logLabel }), format.timestamp(), json());

	return createLogger({
		level: 'info',
		format: formatOpts,
		transports: transportsOpt
	});
};

export default newLogger('Integration Adapter Router');
