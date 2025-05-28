import logger from './logger';

describe('logger', () => {
    let spy: jest.SpyInstance;

    beforeEach(() => {
        spy = jest.spyOn(process.stdout, 'write').mockImplementation(() => true);
    });

    afterEach(() => {
        spy.mockRestore();
    });

    describe('出力されるログはJSON形式で出力されること', () => {
        it('infoレベルのログがJSON形式で出力される', () => {
            logger.info('test message');
            const logArg = spy.mock.calls[0][0].toString();
            expect(() => {
                JSON.parse(logArg);
            }).not.toThrow();
        });
    });

    describe('サービス名が期待通りであること', () => {
        it('infoレベルのログのサービス名がline-messaging-event-handlerであること', () => {
            logger.info('test message');
            const logArg = spy.mock.calls[0][0].toString();
            const logObj = JSON.parse(logArg);
            expect(logObj.service).toBe('line-messaging-event-handler');
        });
    });

    describe('ログレベルによる出力制御がされていること', () => {
        it.each([
            ['debug', false],
            ['info', true],
            ['warn', true],
            ['error', true],
        ])('%sレベルは出力されるべきか: %s', (level, shouldOutput) => {
            // @ts-expect-error: loggerの動的メソッド呼び出しのため
            logger[level](`${level} message`);
            if (shouldOutput) {
                expect(spy).toHaveBeenCalled();
            } else {
                expect(spy).not.toHaveBeenCalled();
            }
        });
    });
});
