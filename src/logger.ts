import * as fs from 'fs';
import * as winston from 'winston';
const env = process.env.NODE_ENV || 'development';
const logDir = 'log';
// Create the log directory if it does not exist
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}
const tsFormat = () => new Date().toLocaleTimeString();
const logger = new winston.Logger({
  transports: [
    // colorize the output to the console
    new winston.transports.Console({
      colorize: true,
      // json: true,
      // stringify: true,
      timestamp: tsFormat
    }),
    new (require('winston-daily-rotate-file'))({
      datePattern: 'yyyy-MM-dd',
      filename: `${logDir}/-results.log`,
      level: env === 'development' ? 'verbose' : 'info',
      prepend: true,
      timestamp: tsFormat
    })
  ]
});

logger.stream = {
  write(message, encoding) {
    logger.info(message.trim());
  }
};

export default logger;
