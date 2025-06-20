import logger from '../../log/logger';
import { Request } from '@google-cloud/functions-framework';
import { validateSignature, WebhookRequestBody, LINE_SIGNATURE_HTTP_HEADER_NAME, WebhookEvent } from '@line/bot-sdk';
/**
 * イベントパースを行い、成功時はevent、失敗時はnullを返す
 *
 * 署名されていないイベントはパースできないイベントとしてnullを返す。
 * @param req HTTPリクエスト
 * @returns eventオブジェクトまたはnull
 */
export async function parseRequest(req: Request, lineChannelSecret: string): Promise<WebhookEvent[] | null> {
    const signature = req.headers[LINE_SIGNATURE_HTTP_HEADER_NAME] as string | undefined;
    if (!signature) {
        logger.error('Signature header is missing');
        return Promise.resolve(null);
    }
    if (!validateSignature(req.rawBody as Buffer, lineChannelSecret, signature)) {
        logger.error('Signature validation failed');
        return Promise.resolve(null);
    }
    if (!isWebhookRequestBody(req.body)) {
        logger.error('Invalid request body format');
        return Promise.resolve(null);
    }
    const body = req.body as WebhookRequestBody;
    return body.events;
}

function isWebhookRequestBody(body: unknown): body is WebhookRequestBody {
    return (
        typeof body === 'object' &&
        body !== null &&
        Array.isArray((body as WebhookRequestBody).events) &&
        (body as WebhookRequestBody).destination !== undefined
    );
}
