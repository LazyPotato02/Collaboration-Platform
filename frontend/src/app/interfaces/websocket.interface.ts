import {TaskInterface} from './task.interface';
import {CommentInterface} from './comment.interface';

export interface WebsocketInterface {
    type: 'task_updated' | 'new_comment';
    task?: TaskInterface;
    task_id?: number;
    comment?: CommentInterface;
}
