const winston = require('winston');

const logger = winston.createLogger({
  level: 'error',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.printf(({ timestamp, level, message, stack }) => {
      return `${timestamp} [${level}]: ${message} ${stack || ''}`;
    })
  ),
  transports: [
    new winston.transports.Console(), // In ra console
    new winston.transports.File({ filename: 'error.log' }) // Ghi vào file
  ],
});

module.exports = logger;