import * as functions from '@google-cloud/functions-framework';
import logger from './log/logger'
import { parseRequest } from './line-messaging-api/request/parseRequest';
import { WebhookEvent } from '@line/bot-sdk';
import { config } from './config';
import { handleEvents } from './line-messaging-api/event/handleEvents';
/**
 * エントリーポイントとなるメイン関数
 *
 */
functions.http('main', (req, res) => {
    logger.info('start')
    logger.debug(req.body)

    parseRequest(req, config.lineChannelSecret)
        .then((events: WebhookEvent[] | null) => {
            if (!events) {
                logger.error('Failed to parse events');
                return;
            }
            logger.debug('Parsed events:', events);
            handleEvents(events);
        })
        .catch(err => {
            logger.error('Error parsing request:', err);
            return;
        });

    // パースに失敗したことをリクエストを送る側が知る必要はないため、HTTPレスポンスは常に同じように返す。
    res.send('OK');
    logger.info('end')
});
