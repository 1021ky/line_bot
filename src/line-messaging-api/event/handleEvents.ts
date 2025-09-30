import { JoinEvent, LeaveEvent, MessageEvent, WebhookEvent, EventMessage, Group } from '@line/bot-sdk';
import logger from '../../log/logger';
import { TextEventMessageWithIsSelf } from '../../types/external/text-event-message-with-isself';
import { messagingApi } from '@line/bot-sdk';

/**
 * LINE Messaging APIのWebhookイベントを処理する関数
 *
 * @param events - Webhookイベントの配列
 */
// TODO: 具体的な処理内容はドメイン層で定義して、引数で渡すようにする
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
            handleMessageEvent(messageEvent);
        }
    });
}

function handleMessageEvent(event: MessageEvent) {
    const message = event.message as EventMessage;
    // TODO: 対応対象であるか判別する関数を定義して、ここで呼び出す
    if (message.type === 'text') {
        const textMessage = message as TextEventMessageWithIsSelf;
        if (textMessage.mention && textMessage.mention.mentionees && textMessage.mention.mentionees.some(m => m.isSelf)) {
            const client = createLineClient();// TODO: DIで注入するようにする
            const to = isGroupEventSource(event) ? (event.source as Group).groupId : '';
            if (to) {
                const replyMessage = `You mentioned me with: ${textMessage.text}`; // 返信メッセージを生成は今は簡単な例にしているが、ここがドメインロジックになる
                sendReply(client, to, replyMessage);
            }
        }
    }
}



function isGroupEventSource(event: WebhookEvent): event is MessageEvent {
    return event.type === 'message' && event.source.type === 'group';
}

function createLineClient() {
    const client = new messagingApi.MessagingApiClient({
        channelAccessToken: process.env.LINE_CHANNEL_ACCESS_TOKEN || '',
    });
    return client;
}

function sendReply(client: messagingApi.MessagingApiClient, to: string, message: string) {
    client.pushMessage(({
        to: to,
        messages: [{ type: 'text', text: message }]
    }));

}