const { createLogger, format, transports } = require('winston');
const { combine, timestamp, printf, colorize } = format;

const logFormat = printf(({ level, message, timestamp }) => {
  return `${timestamp} ${level}: ${message}`;
});

const logger = createLogger({
  format: combine(
    timestamp({ format: 'DD-MM-YYYY HH:mm:ss' }),
    logFormat
  ),
  transports: [
    new transports.Console({
      format: combine(
        colorize(),
        timestamp({ format: 'DD-MM-YYYY HH:mm:ss' }),
        logFormat
      )
    }),
    new transports.File({
      filename: 'logs/app.log',
      format: combine(
        timestamp({ format: 'DD-MM-YYYY HH:mm:ss' }),
        logFormat
      )
    })
  ],
});

module.exports = logger;
