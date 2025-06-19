import { handleEvents } from './handleEvents';
import { WebhookEvent, JoinEvent, LeaveEvent, MessageEvent, TextEventMessage } from '@line/bot-sdk';

describe('handleEvents', () => {
    let logSpy: jest.SpyInstance;

    beforeEach(() => {
        logSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
    });

    afterEach(() => {
        logSpy.mockRestore();
    });

    it('空配列なら何もしない', () => {
        handleEvents([]);
        expect(logSpy).not.toHaveBeenCalled();
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
        expect(logSpy).toHaveBeenCalledWith('Join event:', event);
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
        expect(logSpy).toHaveBeenCalledWith('Leave event:', event);
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
        expect(logSpy).toHaveBeenCalledWith('Message event:', event);
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
        expect(logSpy).toHaveBeenCalledWith('Join event:', joinEvent);
        expect(logSpy).toHaveBeenCalledWith('Leave event:', leaveEvent);
        expect(logSpy).toHaveBeenCalledWith('you said: ', 'hi');
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
        expect(logSpy).not.toHaveBeenCalled();
    });
});
