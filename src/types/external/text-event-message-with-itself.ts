import { TextEventMessage } from '@line/bot-sdk';

//
export type MentioneeWithItself = {
    index: number;
    length: number;
    type: 'user' | 'all';
    userId?: string;
    itself?: boolean;
};

export type TextEventMessageWithItself = Omit<TextEventMessage, 'mention'> & {
    mention?: {
        mentionees?: MentioneeWithItself[];
    };
};
