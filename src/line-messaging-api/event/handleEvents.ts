import { JoinEvent, LeaveEvent, MessageEvent, WebhookEvent, EventMessage } from '@line/bot-sdk';
import logger from '../../log/logger';
import { TextEventMessageWithIsSelf } from 'types/external/text-event-message-with-isself';

/**
 * LINE Messaging APIのWebhookイベントを処理する関数
 * @param events WebhookEventの配列
 */
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
            handleEventMessage(messageEvent);
        }
    });
}

function handleEventMessage(event: MessageEvent) {
    const message = event.message as EventMessage;
    // TODO: 対応対象であるか判別する関数を定義して、ここで呼び出す
    if (message.type === 'text') {
        const textMessage = message as TextEventMessageWithIsSelf;
        if (textMessage.mention && textMessage.mention.mentionees && textMessage.mention.mentionees.some(m => m.isSelf)) {
            logger.info('I was said: ' + textMessage.text);
        }
    }
}