import { FollowEventHandler } from './followEventHandler';
import { LineMessagingEvent } from './lineMessagingEvent';
import logger from '../../log/logger';

describe('FollowEventHandler', () => {
    let infoSpy: jest.SpyInstance;
    beforeEach(() => {
        infoSpy = jest.spyOn(logger, 'info').mockImplementation(() => logger);
    });
    afterEach(() => {
        infoSpy.mockRestore();
    });
    it('handleでlogger.infoが呼ばれる', () => {
        const event = new LineMessagingEvent('follow', 'U123', { type: 'follow', source: { userId: 'U123' } });
        new FollowEventHandler().handle(event);
        expect(infoSpy).toHaveBeenCalledWith('Follow event handled', { userId: event.userId, raw: event.raw });
    });
});
