import { LineMessagingEvent } from './lineMessagingEvent';
import logger from '../../log/logger';

export class FollowEventHandler {
    handle(event: LineMessagingEvent): void {
        // 友だち追加イベントの内容をログ出力
        logger.info('Follow event handled', { userId: event.userId, raw: event.raw });
        // 今回はconsole.logも併用
        console.log('Follow event:', event);
    }
}
