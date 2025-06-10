import { LineMessagingEvent } from './lineMessagingEvent';
import { FollowEventHandler } from './followEventHandler';
import logger from '../../log/logger';

export class EventDispatcher {
    private static handlers: { [key: string]: (event: LineMessagingEvent) => void } = {
        follow: (event) => new FollowEventHandler().handle(event),
        // 今後の拡張用に他のイベントもここに追加可能
    };

    static dispatch(event: LineMessagingEvent): void {
        const handler = this.handlers[event.type];
        if (!handler) {
            logger.error(`No handler found for event type: ${event.type}`);
            return;
        }
        handler(event);
    }
}
