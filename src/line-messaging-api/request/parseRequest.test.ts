import { parseRequest } from './parseRequest';
import { Request } from '@google-cloud/functions-framework';
import * as crypto from 'crypto';

jest.mock('../../log/logger', () => ({
    __esModule: true,
    default: {
        error: jest.fn(),
    },
}));
const makeReq = (body: unknown, secret: string | undefined, signature?: string) => {
    const rawBody = JSON.stringify(body);
    const sig = signature !== undefined ? signature : (secret ? crypto.createHmac('SHA256', secret).update(rawBody).digest('base64') : undefined);
    return {
        headers: { 'x-line-signature': sig },
        rawBody,
        body,
    } as unknown as Request;
};

describe('parseRequest', () => {
    beforeEach(() => {
        process.env.LINE_CHANNEL_SECRET = 'testsecret';
    });
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('署名検証に失敗した場合はnullを返す', async () => {
        const req = makeReq({ destination: 'Uxxxxxxxxxx', events: [] }, 'testsecret', 'invalidsig');
        await expect(parseRequest(req, 'testsecret')).resolves.toBeNull();
    });

    it('パースできない場合はnullを返す', async () => {
        const req = makeReq({ destination: 'Uxxxxxxxxxx', events: null }, 'testsecret');
        await expect(parseRequest(req, 'testsecret')).resolves.toBeNull();
    });

    it('署名検証もパースも成功した場合はeventを返す', async () => {
        const body = {
            destination: 'Uxxxxxxxxxx',
            events: [
                {
                    type: 'message',
                    message: {
                        type: 'text',
                        id: '14353798921116',
                        text: 'Hello, world'
                    },
                    timestamp: 1625665242211,
                    source: {
                        type: 'user',
                        userId: 'U80696558e1aa831...'
                    },
                    replyToken: '757913772c4646b784d4b7ce46d12671',
                    mode: 'active',
                    webhookEventId: '01FZ74A0TDDPYRVKNK77XKC3ZR',
                    deliveryContext: {
                        isRedelivery: false
                    }
                }
            ]
        };
        const req = makeReq(body, 'testsecret');
        const expected = [{ "deliveryContext": { "isRedelivery": false }, "message": { "id": "14353798921116", "text": "Hello, world", "type": "text" }, "mode": "active", "replyToken": "757913772c4646b784d4b7ce46d12671", "source": { "type": "user", "userId": "U80696558e1aa831..." }, "timestamp": 1625665242211, "type": "message", "webhookEventId": "01FZ74A0TDDPYRVKNK77XKC3ZR" }];
        await expect(parseRequest(req, 'testsecret')).resolves.toEqual(expected);
    });
});
