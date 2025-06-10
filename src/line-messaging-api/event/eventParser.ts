import { LineMessagingEvent } from './lineMessagingEvent';
import logger from '../../log/logger';

export class EventParser {
    static parse(body: any): LineMessagingEvent | null {
        try {
            if (!body || !body.events || !Array.isArray(body.events) || body.events.length === 0) {
                logger.error('Request body does not contain valid events array');
                return null;
            }
            const event = body.events[0];
            if (!event.type || !event.source || !event.source.userId) {
                logger.error('Event object missing required fields');
                return null;
            }
            // 仕様に基づき必要な情報を抽出
            return new LineMessagingEvent(event.type, event.source.userId, event);
        } catch (e) {
            logger.error('Failed to parse event', { error: e });
            return null;
        }
    }
}