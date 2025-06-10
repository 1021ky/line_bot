import { SignatureValidator } from './signatureValidator';
import { EventParser } from './eventParser';
import logger from '../../log/logger';
import { Request } from '@google-cloud/functions-framework';

/**
 * イベントパースを行い、成功時はevent、失敗時はnullを返す
 *
 * 署名されていないイベントはパースできないイベントとしてnullを返す。
 * @param req HTTPリクエスト
 * @returns eventオブジェクトまたはnull
 */
export function parseRequest(req: Request): unknown | null {
    const signature = req.headers['x-line-signature'] as string | undefined;
    const rawBody = req.rawBody ? req.rawBody.toString() : JSON.stringify(req.body);
    if (!SignatureValidator.validate(signature, rawBody)) {
        logger.error('Signature validation failed');
        return null;
    }
    const event = EventParser.parse(req.body);
    if (!event) {
        logger.error('Event parse failed');
        return null;
    }
    return event;
}
