import { JoinEvent, LeaveEvent, WebhookEvent } from '@line/bot-sdk';

export function handleEvents(events: WebhookEvent[]) {
    events.forEach(event => {
        if (event.type === 'join') {
            // JoinEventにキャスト
            const joinEvent = event as JoinEvent;
            // joinEvent特有のプロパティが使える
            console.log('Join event:', joinEvent.replyToken);
        } else if (event.type === 'leave') {
            // LeaveEventにキャスト
            const leaveEvent = event as LeaveEvent;
            // leaveEvent特有のプロパティが使える
            console.log('Leave event:', leaveEvent.source);
        }
    });
}