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
        if (!textMessage) {
            return;
        }

        if (!this.isMentionToSelf(textMessage)) {
            return;
        }

        const to = this.extractGroupId(event);
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

    private isMentionToSelf(message: TextEventMessageWithIsSelf): boolean {
        return Boolean(message.mention?.mentionees?.some(mention => mention.isSelf));
    }

    private extractGroupId(event: MessageEvent): string | null {
        if (event.source.type === 'group') {
            return event.source.groupId;
        }
        return null;
    }

    private makeReplyMessage(text: string): string {
        const replacedText = text.replace(`@${this.botName} `, '');
        return `You mentioned me with: ${replacedText}`;
    }
}
