import {UserInterface} from './user.interface';

export interface CommentInterface {
    id: number;
    user: UserInterface
    content: string;
    timestamp: string;
    is_deleted: boolean;
    task: number;
}
