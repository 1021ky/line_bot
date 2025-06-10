import { SignatureValidator } from './signatureValidator';
import logger from '../../log/logger';
import crypto from 'crypto';

describe('SignatureValidator', () => {
    const OLD_ENV = process.env;
    let errorSpy: jest.SpyInstance;
    beforeEach(() => {
        jest.resetModules();
        process.env = { ...OLD_ENV, LINE_CHANNEL_SECRET: 'testsecret' };
        errorSpy = jest.spyOn(logger, 'error').mockImplementation(() => undefined as unknown as typeof logger);
    });
    afterAll(() => {
        process.env = OLD_ENV;
        errorSpy.mockRestore();
    });

    it('正しい署名ならtrue', () => {
        const body = 'testbody';
        const signature = crypto.createHmac('sha256', 'testsecret').update(body).digest('base64');
        expect(SignatureValidator.validate(signature, body)).toBe(true);
    });

    it('署名が不正ならfalse', () => {
        expect(SignatureValidator.validate('invalid', 'testbody')).toBe(false);
        expect(errorSpy).toHaveBeenCalledWith('Signature validation failed');
    });

    it('シークレット未設定ならfalse', () => {
        process.env.LINE_CHANNEL_SECRET = '';
        expect(SignatureValidator.validate('sig', 'body')).toBe(false);
        expect(errorSpy).toHaveBeenCalledWith('LINE_CHANNEL_SECRET is not set');
    });

    it('署名ヘッダなしならfalse', () => {
        expect(SignatureValidator.validate(undefined, 'body')).toBe(false);
        expect(errorSpy).toHaveBeenCalledWith('Signature header is missing');
    });
});
