jest.mock('../../log/logger', () => ({
    __esModule: true,
    default: {
        debug: jest.fn(),
        info: jest.fn(),
        error: jest.fn(),
    },
}));

import { handleEvents } from './handleEvents';
import { JoinEvent, LeaveEvent, MessageEvent, WebhookEvent } from '@line/bot-sdk';

// ここでは各ハンドラの詳細な動作確認は行わず、エラーがなく呼び出されることのみを確認する。
// 各ハンドラの詳細な動作確認はそれぞれのハンドラのテストコードで行う。
describe('handleEvents', () => {
    const mockMessageEventHandler = { handle: jest.fn<Promise<void>, [MessageEvent]>() };

    beforeEach(() => {
        jest.clearAllMocks();
        mockMessageEventHandler.handle.mockResolvedValue(undefined);
    });


    it('空配列なら何もしない', async () => {
        await handleEvents([]);
    });

    it('joinイベントが渡されたときに正常に処理される', async () => {
        const event: JoinEvent = {
            type: 'join',
            replyToken: 'token',
            source: { type: 'group', groupId: 'gid' },
            mode: 'active',
            timestamp: 0,
            webhookEventId: 'webhookId',
            deliveryContext: { isRedelivery: false },
        };
        await handleEvents([event]);
    });

    it('leaveイベントが渡されたときに正常に処理される', async () => {
        const event: LeaveEvent = {
            type: 'leave',
            source: { type: 'group', groupId: 'gid' },
            mode: 'active',
            timestamp: 0,
            webhookEventId: 'webhookId',
            deliveryContext: { isRedelivery: false },
        };
        await handleEvents([event]);
    });

    it('messageイベントが渡されたときに正常に処理される', async () => {
        const event: MessageEvent = {
            type: 'message',
            message: {
                type: 'text',
                id: 'id',
                text: 'hello',
                quoteToken: 'quote',
            },
            replyToken: 'token',
            source: { type: 'user', userId: 'uid' },
            mode: 'active',
            timestamp: 0,
            webhookEventId: 'webhookId',
            deliveryContext: { isRedelivery: false },
        };

        await handleEvents([event]);
    });

    it('複数イベントが渡されたときに正常に処理される', async () => {
        const joinEvent: JoinEvent = {
            type: 'join',
            replyToken: 'token',
            source: { type: 'group', groupId: 'gid' },
            mode: 'active',
            timestamp: 0,
            webhookEventId: 'webhookId',
            deliveryContext: { isRedelivery: false },
        };
        const leaveEvent: LeaveEvent = {
            type: 'leave',
            source: { type: 'group', groupId: 'gid' },
            mode: 'active',
            timestamp: 0,
            webhookEventId: 'webhookId',
            deliveryContext: { isRedelivery: false },
        };
        const messageEvent: MessageEvent = {
            type: 'message',
            message: {
                type: 'text',
                id: 'id',
                text: 'hi',
                quoteToken: 'quote',
            },
            replyToken: 'token',
            source: { type: 'user', userId: 'uid' },
            mode: 'active',
            timestamp: 0,
            webhookEventId: 'webhookId',
            deliveryContext: { isRedelivery: false },
        };

        await handleEvents([joinEvent, leaveEvent, messageEvent]);
    });

    it('未対応イベントが渡されたときも正常に処理される', async () => {
        const event: WebhookEvent = {
            type: 'postback',
            postback: { data: 'data' },
            source: { type: 'user', userId: 'uid' },
            mode: 'active',
            timestamp: 0,
            webhookEventId: 'webhookId',
            deliveryContext: { isRedelivery: false },
        } as WebhookEvent;

        await handleEvents([event]);
    });
});
