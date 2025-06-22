import { TextEventMessage } from '@line/bot-sdk';

//
export type MentioneeWithIsSelf = {
    index: number;
    length: number;
    type: 'user' | 'all';
    userId?: string;
    isSelf?: boolean;
};

export type TextEventMessageWithIsSelf = Omit<TextEventMessage, 'mention'> & {
    mention?: {
        mentionees?: MentioneeWithIsSelf[];
    };
};
