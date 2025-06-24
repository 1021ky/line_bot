import logger from './logger';
import { transports } from 'winston';
import stream from 'stream';

describe('logger', () => {
    let output = '';
    let writable: stream.Writable;
    const originalTransports = logger.transports.slice();

    beforeEach(() => {
        // 出力をキャプチャするためのWritableストリームを作成。process.stdoutが使えない環境でも動作するようにする。
        output = '';
        writable = new stream.Writable({
            write(chunk, encoding, callback) {
                output += chunk.toString();
                callback();
            }
        });
        logger.clear();
        logger.add(new transports.Stream({ stream: writable }));
    });

    afterEach(() => {
        logger.clear();
        // 元のトランスポートを復元
        for (const t of originalTransports) {
            logger.add(t);
        }
    });

    describe('出力されるログはJSON形式で出力されること', () => {
        it('infoレベルのログがJSON形式で出力される', () => {
            logger.info('test message');
            expect(() => {
                JSON.parse(output);
            }).not.toThrow();
        });
    });

    describe('サービス名が期待通りであること', () => {
        it('infoレベルのログのサービス名がline-messaging-event-handlerであること', () => {
            logger.info('test message');
            const logObj = JSON.parse(output);
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
            output = '';
            // @ts-expect-error: loggerの動的メソッド呼び出しのため
            logger[level](`${level} message`);
            if (shouldOutput) {
                expect(output).not.toBe('');
            } else {
                expect(output).toBe('');
            }
        });
    });
});
