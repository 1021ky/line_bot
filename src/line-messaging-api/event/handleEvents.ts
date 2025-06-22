import { JoinEvent, LeaveEvent, MessageEvent, WebhookEvent, EventMessage } from '@line/bot-sdk';
import logger from '../../log/logger';
import { TextEventMessageWithIsSelf } from 'types/external/text-event-message-with-isself';

export function handleEvents(events: WebhookEvent[]) {
    logger.info('events:', events)
    events.forEach(event => {
        if (event.type === 'join') {
            const joinEvent = event as JoinEvent;
            logger.debug('Join event:', joinEvent);
        } else if (event.type === 'leave') {
            const leaveEvent = event as LeaveEvent;
            logger.debug('Leave event:', leaveEvent);
        } else if (event.type === 'message') {
            const messageEvent = event as MessageEvent;
            logger.debug('Message event:', messageEvent);
            handleEventMessage(messageEvent.message);
        }
    });
}

function handleEventMessage(message: EventMessage) {
    if (message.type === 'text') {
        const textMessage = message as TextEventMessageWithIsSelf;
        if (textMessage.mention && textMessage.mention.mentionees && textMessage.mention.mentionees.some(m => m.isSelf)) {
            logger.info('I was said: ' + textMessage.text);
        }
    }
}