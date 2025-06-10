export type EventType = 'follow' | string;

export class LineMessagingEvent {
    readonly type: EventType;
    readonly userId: string;
    readonly raw: any;

    constructor(type: EventType, userId: string, raw: any) {
        this.type = type;
        this.userId = userId;
        this.raw = raw;
    }
}
