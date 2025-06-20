jest.mock('../../log/logger', () => ({
    __esModule: true,
    default: {
        debug: jest.fn(),
    },
}));

import { handleEvents } from './handleEvents';
import { WebhookEvent, JoinEvent, LeaveEvent, MessageEvent, TextEventMessage } from '@line/bot-sdk';
import logger from '../../log/logger';
import { TextEventMessageWithItself } from '../../types/external/text-event-message-with-itself';

describe('handleEvents', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('空配列なら何もしない', () => {
        handleEvents([]);
        expect(logger.debug).not.toHaveBeenCalled();
    });

    it('joinイベントを判別して処理する', () => {
        const event: JoinEvent = {
            type: 'join',
            replyToken: 'token',
            source: { type: 'group', groupId: 'gid' },
            mode: 'active',
            timestamp: 0,
            webhookEventId: 'webhookId',
            deliveryContext: { isRedelivery: false },
        };
        handleEvents([event]);
        expect(logger.debug).toHaveBeenCalledWith('Join event:', event);
    });

    it('leaveイベントを判別して処理する', () => {
        const event: LeaveEvent = {
            type: 'leave',
            source: { type: 'group', groupId: 'gid' },
            mode: 'active',
            timestamp: 0,
            webhookEventId: 'webhookId',
            deliveryContext: { isRedelivery: false },
        };
        handleEvents([event]);
        expect(logger.debug).toHaveBeenCalledWith('Leave event:', event);
    });

    it('messageイベント（text）を判別して処理する', () => {
        const message: TextEventMessage = {
            type: 'text',
            id: 'id',
            text: 'hello',
            quoteToken: 'quoteToken',
        };
        const event: MessageEvent = {
            type: 'message',
            message,
            replyToken: 'token',
            source: { type: 'user', userId: 'uid' },
            mode: 'active',
            timestamp: 0,
            webhookEventId: 'webhookId',
            deliveryContext: { isRedelivery: false },
        };
        handleEvents([event]);
        expect(logger.debug).toHaveBeenCalledWith('Message event:', event);
    });

    it('ボットへのメンションがあるtextメッセージならログを出力する', () => {
        const message: TextEventMessageWithItself = {
            type: 'text',
            id: 'id',
            text: 'hello mention',
            quoteToken: 'quoteToken',
            mention: {
                mentionees: [
                    { index: 0, length: 5, userId: 'bot', type: 'user', itself: true }
                ]
            }
        };
        const event: MessageEvent = {
            type: 'message',
            message: message as unknown as TextEventMessage, // TypeScriptの型互換性のためにキャスト
            replyToken: 'token',
            source: { type: 'user', userId: 'uid' },
            mode: 'active',
            timestamp: 0,
            webhookEventId: 'webhookId',
            deliveryContext: { isRedelivery: false },
        };
        handleEvents([event]);
        expect(logger.debug).toHaveBeenCalledWith('you said: ', message.text);
    });

    it('処理対象のイベントが複数来たときすべて処理する', () => {
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
        const message: TextEventMessage = {
            type: 'text',
            id: 'id',
            text: 'hi',
            quoteToken: 'quoteToken',
        };
        const messageEvent: MessageEvent = {
            type: 'message',
            message,
            replyToken: 'token',
            source: { type: 'user', userId: 'uid' },
            mode: 'active',
            timestamp: 0,
            webhookEventId: 'webhookId',
            deliveryContext: { isRedelivery: false },
        };
        handleEvents([joinEvent, leaveEvent, messageEvent]);
        expect(logger.debug).toHaveBeenCalledWith('Join event:', joinEvent);
        expect(logger.debug).toHaveBeenCalledWith('Leave event:', leaveEvent);
        expect(logger.debug).toHaveBeenCalledWith('Message event:', messageEvent);
    });

    it('未対応イベントは何も出力しない', () => {
        const event: WebhookEvent = {
            type: 'postback',
            postback: { data: 'data' },
            source: { type: 'user', userId: 'uid' },
            mode: 'active',
            timestamp: 0,
            webhookEventId: 'webhookId',
            deliveryContext: { isRedelivery: false },
        } as WebhookEvent;
        handleEvents([event]);
        expect(logger.debug).not.toHaveBeenCalled();
    });
});
