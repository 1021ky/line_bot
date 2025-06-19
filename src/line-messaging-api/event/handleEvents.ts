import { JoinEvent, LeaveEvent, MessageEvent, WebhookEvent, TextEventMessage, EventMessage } from '@line/bot-sdk';

export function handleEvents(events: WebhookEvent[]) {
    events.forEach(event => {
        if (event.type === 'join') {
            const joinEvent = event as JoinEvent;
            console.log('Join event:', joinEvent);
        } else if (event.type === 'leave') {
            const leaveEvent = event as LeaveEvent;
            console.log('Leave event:', leaveEvent);
        } else if (event.type === 'message') {
            const messageEvent = event as MessageEvent;
            console.log('Message event:', messageEvent);
            handleEventMessage(messageEvent.message);
        }
    });
}

function handleEventMessage(message: EventMessage) {
    if (message.type === 'text') {
        const textMessage = message as TextEventMessage;
        console.log('you said: ', textMessage.text); // ここでメッセージの内容を処理する
        return;
    }
}