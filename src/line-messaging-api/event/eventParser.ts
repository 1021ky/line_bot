import { LineMessagingEvent } from './lineMessagingEvent';
import logger from '../../log/logger';

export function parseEvent(body: any): LineMessagingEvent | null {
    try {
        if (!body || !body.events) {
            logger.error('Request body does not contain valid events array');
            return null;
        }
        // 配列でなければ単一イベントとして扱う
        const event = Array.isArray(body.events) ? body.events[0] : body.events;
        if (!event || !event.type || !event.source || !event.source.userId || !event.message) {
            logger.error('Event object missing required fields');
            return null;
        }
        return new LineMessagingEvent(event.type, event.source.userId, event);
    } catch (e) {
        logger.error('Failed to parse event', { error: e });
        return null;
    }
}