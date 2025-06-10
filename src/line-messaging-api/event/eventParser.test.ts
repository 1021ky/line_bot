import { EventParser } from './eventParser';
import { LineMessagingEvent } from './lineMessagingEvent';
import logger from '../../log/logger';

describe('EventParser', () => {
    let errorSpy: jest.SpyInstance;
    beforeEach(() => {
        errorSpy = jest.spyOn(logger, 'error').mockImplementation(() => undefined as unknown as typeof logger);
    });
    afterEach(() => {
        errorSpy.mockRestore();
    });
    it('正常なイベントボディをパースできる', () => {
        const body = {
            events: [
                {
                    type: 'follow',
                    source: { userId: 'U123' },
                    replyToken: 'token',
                },
            ],
        };
        const event = EventParser.parse(body);
        expect(event).toBeInstanceOf(LineMessagingEvent);
        expect(event?.type).toBe('follow');
        expect(event?.userId).toBe('U123');
    });

    it('不正なボディはnullを返す', () => {
        expect(EventParser.parse({})).toBeNull();
        expect(EventParser.parse({ events: [] })).toBeNull();
        expect(EventParser.parse({ events: [{}] })).toBeNull();
        expect(errorSpy).toHaveBeenCalled();
    });
});