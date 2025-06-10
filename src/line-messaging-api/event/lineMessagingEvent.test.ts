import { LineMessagingEvent } from './lineMessagingEvent';

describe('LineMessagingEvent', () => {
    it('プロパティが正しくセットされる', () => {
        const event = new LineMessagingEvent('follow', 'U123', { foo: 'bar' });
        expect(event.type).toBe('follow');
        expect(event.userId).toBe('U123');
        expect(event.raw).toEqual({ foo: 'bar' });
    });
});
