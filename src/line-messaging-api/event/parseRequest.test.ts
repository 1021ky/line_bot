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
    const sig = signature !== undefined ? signature : (secret ? crypto.createHmac('sha256', secret).update(rawBody).digest('base64') : undefined);
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

    it('署名検証に失敗した場合はnullを返す', () => {
        const req = makeReq({ destination: 'Uxxxxxxxxxx', events: [] }, 'testsecret', 'invalidsig');
        expect(parseRequest(req)).toBeNull();
    });

    it('パースできない場合はnullを返す', () => {
        // eventsが配列でない場合など、パースできないケース
        const req = makeReq({ destination: 'Uxxxxxxxxxx', events: null }, 'testsecret');
        expect(parseRequest(req)).toBeNull();
    });

    it('署名検証もパースも成功した場合はeventを返す', () => {
        // https://developers.line.biz/ja/reference/messaging-api/#webhook-event-objects に沿って作成したテストデータ
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
        // EventParserの仕様に合わせて期待値を作成
        const expected = {
            type: 'message',
            userId: 'U80696558e1aa831...',
            raw: body.events[0]
        };
        expect(parseRequest(req)).toEqual(expected);
    });
});
