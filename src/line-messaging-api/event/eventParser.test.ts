import { parseEvent } from './eventParser';
import logger from '../../log/logger';
import { LineMessagingEvent } from './lineMessagingEvent';

describe('parseEvent', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('正しいイベントボディならLineMessagingEventを返す', () => {
        const body = {
            destination: 'Uxxxxxxxxxx',
            events: [
                {
                    type: 'message',
                    message: {
                        type: 'text',
                        id: '14353798921116',
                        text: 'Hello, world',
                    },
                    timestamp: 1625665242211,
                    source: {
                        type: 'user',
                        userId: 'U80696558e1aa831...',
                    },
                    replyToken: '757913772c4646b784d4b7ce46d12671',
                    mode: 'active',
                    webhookEventId: '01FZ74A0TDDPYRVKNK77XKC3ZR',
                    deliveryContext: {
                        isRedelivery: false,
                    },
                },
            ],
        };
        const expected = new LineMessagingEvent('message', 'U80696558e1aa831...', body.events[0]);
        expect(parseEvent(body)).toEqual(expected);
    });

    it('eventsが配列ではなくオブジェクトならLineMessagingEventを返す', () => {
        const eventObj = {
            type: 'message',
            message: {
                type: 'text',
                id: '14353798921116',
                text: 'Hello, world',
            },
            timestamp: 1625665242211,
            source: {
                type: 'user',
                userId: 'U80696558e1aa831...',
            },
            replyToken: '757913772c4646b784d4b7ce46d12671',
            mode: 'active',
            webhookEventId: '01FZ74A0TDDPYRVKNK77XKC3ZR',
            deliveryContext: {
                isRedelivery: false,
            },
        };
        const body = {
            destination: 'Uxxxxxxxxxx',
            events: eventObj,
        };
        const expected = new LineMessagingEvent('message', 'U80696558e1aa831...', eventObj);
        expect(parseEvent(body)).toEqual(expected);
    });

    it('eventsが空配列ならnull', () => {
        const body = { destination: 'Uxxxxxxxxxx', events: [] };
        expect(parseEvent(body)).toBeNull();
    });

    it('必須フィールドが足りない場合はnull', () => {
        const body = { destination: 'Uxxxxxxxxxx', events: [{ type: 'message', source: { userId: 'U80696558e1aa831...' } }] };
        expect(parseEvent(body)).toBeNull();
    });
});