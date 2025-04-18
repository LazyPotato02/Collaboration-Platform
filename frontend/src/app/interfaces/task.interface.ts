import {CommentInterface} from './comment.interface';

export interface TaskInterface {
    id: number;
    title: string;
    description: string;
    due_date: string
    "status": 'planning' | 'to_do' | 'in_progress' | 'done' | 'finished';
    "created_at": string
    "is_deleted": boolean
    "project": number;
    "assigned_to": number | null;

    comments?: CommentInterface[];
    newComment?: string;
}
