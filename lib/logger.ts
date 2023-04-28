import Winston from 'winston'

const transports: Array<Winston.transport> = []

transports.push(
  new Winston.transports.Console({
    format: Winston.format.combine(
      Winston.format.cli(),
      Winston.format.splat(),
    ),
  }),
)

export const logger: Winston.Logger = Winston.createLogger({
  level: 'debug',
  levels: Winston.config.npm.levels,
  format: Winston.format.combine(
    Winston.format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss',
    }),
    Winston.format.errors({ stack: true }),
    Winston.format.splat(),
    Winston.format.json(),
  ),
  silent: false,
  transports,
})

export const LoggerStream = {
  write: (msg: string): void => {
    logger.info(msg.replace(/(\n)/gm, ''))
  },
}

