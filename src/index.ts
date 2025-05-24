import * as functions from '@google-cloud/functions-framework';
import logger from './log/logger'

/**
 * エントリーポイントとなるメイン関数
 *
 */
functions.http('main', (req, res) => {
    logger.info('start')
    // Your code here

    // Send an HTTP response
    res.send('OK');
    logger.info('end')
});
