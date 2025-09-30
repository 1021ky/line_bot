import { JoinEvent, LeaveEvent, MessageEvent, WebhookEvent, messagingApi } from '@line/bot-sdk';
import logger from '../../log/logger';
import { MessageEventHandler } from './messageEventHandler';

export interface EventHandler {
    handle(event: MessageEvent): Promise<void>;
}

/**
 * LINE Messaging APIのWebhookイベントを処理する関数
 *
 * @param events - Webhookイベントの配列
 */
export async function handleEvents(events: WebhookEvent[]): Promise<void> {
    logger.info('events:', events);

    await Promise.all(events.map(async (event) => {
        if (event.type === 'join') {
            const joinEvent = event as JoinEvent;
            logger.debug('Join event:', joinEvent);
        } else if (event.type === 'leave') {
            const leaveEvent = event as LeaveEvent;
            logger.debug('Leave event:', leaveEvent);
        } else if (event.type === 'message') {
            const messageEvent = event as MessageEvent;
            logger.debug('Message event:', messageEvent);
            const client = createLineClient();
            const botName = process.env.LINE_BOT_NAME || 'bot';
            const messageEventHandler = new MessageEventHandler(client, botName);
            await messageEventHandler.handle(messageEvent);
        }
    }));
}

function createLineClient() {
    const client = new messagingApi.MessagingApiClient({
        channelAccessToken: process.env.LINE_CHANNEL_ACCESS_TOKEN || '',
    });
    return client;
}
