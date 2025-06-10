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

    it('eventsが空配列ならnull', () => {
        const body = { destination: 'Uxxxxxxxxxx', events: [] };
        expect(parseEvent(body)).toBeNull();
    });

    it('eventsが配列でないならnull', () => {
        const body = { destination: 'Uxxxxxxxxxx', events: null };
        expect(parseEvent(body)).toBeNull();
    });

    it('必須フィールドが足りない場合はnull', () => {
        const body = { destination: 'Uxxxxxxxxxx', events: [{ type: 'message' }] };
        expect(parseEvent(body)).toBeNull();
    });

    it('例外発生時はnull', () => {
        // body.events[0]がgetterで例外を投げる場合など
        const body = { destination: 'Uxxxxxxxxxx', events: [{}] };
        expect(parseEvent(body)).toBeNull();
    });
});