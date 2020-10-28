import * as winston from 'winston'
import * as path from 'path'
const config = require('../config')

const errorLogPath = path.join(config.logPath, 'siad-error.log')
const stdoutLogPath = path.join(config.logPath, 'siad-stdout.log')
const combinedLogPath = path.join(config.logPath, 'siad-combined.log')
const format = winston.format

export const siadLogger = winston.createLogger({
  level: 'info',
  format: format.combine(
    format.label({ label: '[siad]' }),
    format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss'
    }),
    //
    // The simple format outputs
    // `${level}: ${message} ${[Object with everything else]}`
    //
    format.printf(info => `${info.timestamp} ${info.level}: ${info.message}`)
    //
    // Alternatively you could use this custom printf format if you
    // want to control where the timestamp comes in your final message.
    // Try replacing `format.simple()` above with this:
    //
    // format.printf(info => `${info.timestamp} ${info.level}: ${info.message}`)
  ),
  transports: [
    //
    // - Write to all logs with level `info` and below to `combined.log`
    // - Write all logs error (and below) to `error.log`.
    //
    new winston.transports.File({ filename: errorLogPath, level: 'error' }),
    new winston.transports.File({ filename: stdoutLogPath, level: 'info' }),
    new winston.transports.File({ filename: combinedLogPath })
  ]
})

siadLogger.add(
  new winston.transports.Console({
    format: winston.format.combine(winston.format.colorize(), winston.format.simple())
  })
)
