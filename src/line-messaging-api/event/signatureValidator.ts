import crypto from 'crypto';
import logger from '../../log/logger';

export class SignatureValidator {
    static validate(signature: string | undefined, body: string): boolean {
        const channelSecret = process.env.LINE_CHANNEL_SECRET;
        if (!channelSecret) {
            logger.error('LINE_CHANNEL_SECRET is not set');
            return false;
        }
        if (!signature) {
            logger.error('Signature header is missing');
            return false;
        }
        try {
            const hash = crypto.createHmac('sha256', channelSecret).update(body).digest('base64');
            if (hash !== signature) {
                logger.error('Signature validation failed');
                return false;
            }
            return true;
        } catch (e) {
            logger.error('Signature validation error', { error: e });
            return false;
        }
    }
}
