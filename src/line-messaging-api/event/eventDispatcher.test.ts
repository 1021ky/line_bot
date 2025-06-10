import { EventDispatcher } from './eventDispatcher';
import { LineMessagingEvent } from './lineMessagingEvent';
import logger from '../../log/logger';

describe('EventDispatcher', () => {
    let infoSpy: jest.SpyInstance;
    let errorSpy: jest.SpyInstance;
    beforeEach(() => {
        infoSpy = jest.spyOn(logger, 'info').mockImplementation(() => logger);
        errorSpy = jest.spyOn(logger, 'error').mockImplementation(() => logger);
    });
    afterEach(() => {
        infoSpy.mockRestore();
        errorSpy.mockRestore();
    });
    it('followイベントでハンドラが呼ばれる', () => {
        const event = new LineMessagingEvent('follow', 'U123', { type: 'follow', source: { userId: 'U123' } });
        EventDispatcher.dispatch(event);
        expect(infoSpy).toHaveBeenCalledWith('Follow event handled', { userId: event.userId, raw: event.raw });
    });

    it('未対応イベントはlogger.errorが呼ばれる', () => {
        const event = new LineMessagingEvent('unknown', 'U123', { type: 'unknown', source: { userId: 'U123' } });
        EventDispatcher.dispatch(event);
        expect(errorSpy).toHaveBeenCalledWith('No handler found for event type: unknown');
    });
});
