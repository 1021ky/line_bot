import winston from 'winston';

/**
 * Winstonを使用したロガー
 * このロガーは、コンソールにJSON形式でメッセージをログ出力する。
 */
const logger = winston.createLogger({
    level: 'info',
    format: winston.format.json(),
    defaultMeta: { service: 'line-messaging-event-handler' },
    transports: [
        new winston.transports.Console(),
    ],
});

export default logger;
