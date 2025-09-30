jest.mock('../../log/logger', () => ({
    __esModule: true,
    default: {
        debug: jest.fn(),
        info: jest.fn(),
        error: jest.fn(),
    },
}));

import { MessageEvent, TextEventMessage, messagingApi } from '@line/bot-sdk';
import { MessageEventHandler } from './messageEventHandler';
import { TextEventMessageWithIsSelf } from '../../types/external/text-event-message-with-isself';
import logger from '../../log/logger';

describe('MessageEventHandler', () => {
    const lineClient = {
        pushMessage: jest.fn<Promise<messagingApi.PushMessageResponse>, [messagingApi.PushMessageRequest]>(),
    } as unknown as jest.Mocked<messagingApi.MessagingApiClient>; // 詳細な型情報は不要なのでunknown経由でキャスト

    beforeEach(() => {
        jest.clearAllMocks();
        lineClient.pushMessage.mockResolvedValue({} as messagingApi.PushMessageResponse);
    });

    it('グループでボットへのメンションがあるtextメッセージならpushMessageを送信する', async () => {
        const message: TextEventMessageWithIsSelf = {
            type: 'text',
            id: 'id',
            text: '@bot hello mention',
            quoteToken: 'quoteToken',
            mention: {
                mentionees: [
                    { index: 0, length: 5, userId: 'bot', type: 'user', isSelf: true },
                ],
            },
        };
        const event: MessageEvent = {
            type: 'message',
            message: message as unknown as TextEventMessage,
            replyToken: 'token',
            source: { type: 'group', groupId: 'gid' },
            mode: 'active',
            timestamp: 0,
            webhookEventId: 'webhookId',
            deliveryContext: { isRedelivery: false },
        };

        const handler = new MessageEventHandler(
            lineClient,
            'bot',
        );

        await handler.handle(event);

        expect(lineClient.pushMessage).toHaveBeenCalledWith({
            to: 'gid',
            messages: [{ type: 'text', text: 'You mentioned me with: hello mention' }],
        });
    });

    it('メンションが無ければpushMessageを送信しない', async () => {
        const event: MessageEvent = {
            type: 'message',
            message: {
                type: 'text',
                id: 'id',
                text: 'hello',
                quoteToken: 'quoteToken',
            },
            replyToken: 'token',
            source: { type: 'group', groupId: 'gid' },
            mode: 'active',
            timestamp: 0,
            webhookEventId: 'webhookId',
            deliveryContext: { isRedelivery: false },
        };

        const handler = new MessageEventHandler(
            lineClient,
            'bot',
        );

        await handler.handle(event);

        expect(lineClient.pushMessage).not.toHaveBeenCalled();
    });

    // 古いバージョンでしか存在しない複数人トークは対応しない
    it('グループとユーザー以外のソースならpushMessageを送信しない', async () => {
        const message: TextEventMessageWithIsSelf = {
            type: 'text',
            id: 'id',
            text: '@bot hello',
            quoteToken: 'quoteToken',
            mention: {
                mentionees: [
                    { index: 0, length: 5, userId: 'bot', type: 'user', isSelf: true },
                ],
            },
        };
        const event: MessageEvent = {
            type: 'message',
            message: message as unknown as TextEventMessage,
            replyToken: 'token',
            source: { type: 'room', roomId: 'rid' },
            mode: 'active',
            timestamp: 0,
            webhookEventId: 'webhookId',
            deliveryContext: { isRedelivery: false },
        };

        const handler = new MessageEventHandler(
            lineClient,
            'bot',
        );

        await handler.handle(event);

        expect(lineClient.pushMessage).not.toHaveBeenCalled();
    });

    it('pushMessageが失敗したらlogger.errorを呼び出す', async () => {
        const message: TextEventMessageWithIsSelf = {
            type: 'text',
            id: 'id',
            text: '@bot hello',
            quoteToken: 'quoteToken',
            mention: {
                mentionees: [
                    { index: 0, length: 5, userId: 'bot', type: 'user', isSelf: true },
                ],
            },
        };
        const event: MessageEvent = {
            type: 'message',
            message: message as unknown as TextEventMessage,
            replyToken: 'token',
            source: { type: 'group', groupId: 'gid' },
            mode: 'active',
            timestamp: 0,
            webhookEventId: 'webhookId',
            deliveryContext: { isRedelivery: false },
        };

        const handler = new MessageEventHandler(
            lineClient,
            'bot',
        );

        const error = new Error('push failed');
        lineClient.pushMessage.mockRejectedValueOnce(error);

        await handler.handle(event);

        expect(logger.error).toHaveBeenCalledWith('Failed to send reply:', error);
    });
});
