import { MessageEvent, messagingApi } from '@line/bot-sdk';
import logger from '../../log/logger';
import { EventHandler } from './handleEvents';
import { TextEventMessageWithIsSelf } from '../../types/external/text-event-message-with-isself';



export class MessageEventHandler implements EventHandler {

    private readonly lineClient: messagingApi.MessagingApiClient;
    private readonly botName: string;

    constructor(lineClient: messagingApi.MessagingApiClient, botName: string) {
        this.lineClient = lineClient;
        this.botName = botName;
    }

    async handle(event: MessageEvent): Promise<void> {
        const textMessage = this.extractTextMessage(event);
        if (!this.shouldReplyToMessage(event)) {
            return;
        }

        if (!textMessage) {
            return;
        }

        const to = this.extractAddress(event);
        if (!to) {
            return;
        }

        const replyMessage = this.makeReplyMessage(textMessage.text);

        try {
            await this.lineClient.pushMessage({
                to,
                messages: [{ type: 'text', text: replyMessage }],
            });
        } catch (error) {
            logger.error('Failed to send reply:', error);
        }
    }

    private extractTextMessage(event: MessageEvent): TextEventMessageWithIsSelf | null {
        if (event.message.type !== 'text') {
            return null;
        }
        return event.message as TextEventMessageWithIsSelf;
    }

    private shouldReplyToMessage(event: MessageEvent): boolean {
        if (event.message.type !== 'text') {
            return false;
        }

        // グループ内の他のメンバー向けのメッセージに反応しないようにする
        if (event.source.type === 'group' && !this.isMentionToSelf(event)) {
            return false;
        }

        return true;
    }
    private isMentionToSelf(event: MessageEvent): boolean {
        const message = event.message as TextEventMessageWithIsSelf;
        return Boolean(message.mention?.mentionees?.some(mention => mention.isSelf));
    }

    private extractAddress(event: MessageEvent): string | null {
        if (event.source.type === 'group') {
            return event.source.groupId;
        } else if (event.source.type === 'user') {
            return event.source.userId;
        }
        return null;
    }

    private makeReplyMessage(text: string): string {

        const cleanText = text.replace(new RegExp(`^\\s*@${this.botName}(\\s|\\b|$)`), '');
        return `You mentioned me with: ${cleanText}`;
    }
}
