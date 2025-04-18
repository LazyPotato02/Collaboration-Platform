import {Component, ElementRef, ViewChild} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Subscription} from 'rxjs';
import {ProjectServices} from '../services/projects/project.services';
import {CommonModule, NgClass, NgForOf} from '@angular/common';
import {WebSocketService} from '../services/websocket/websocket.service';
import {CdkDrag, CdkDragDrop, CdkDropList, DragDropModule, transferArrayItem} from '@angular/cdk/drag-drop';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {MatSnackBar, MatSnackBarModule} from '@angular/material/snack-bar';
import {TaskInterface} from '../interfaces/task.interface';
import {ProjectUsersInterface, UserInterface} from '../interfaces/user.interface';

@Component({
    selector: 'app-projects',
    imports: [
        NgForOf,
        CdkDropList,
        DragDropModule,
        CdkDrag,
        NgClass,
        CommonModule,
        ReactiveFormsModule,
        MatSnackBarModule,
        FormsModule
    ],
    templateUrl: './projects.component.html',
    styleUrl: './projects.component.css',
})
export class ProjectsComponent {
    @ViewChild('commentList') commentListRef!: ElementRef;
    id: number | undefined;
    projectTasks: TaskInterface[] = [];
    private routeSub!: Subscription;
    statuses = ['planning', 'to_do', 'in_progress', 'done'];
    dropListIds = this.statuses.map(status => `list-${status}`);
    form: FormGroup;
    isEditMode = false;
    editedTaskId: number | null = null;
    showForm = false;
    showConfirmDelete = false;
    taskToDelete: any = null;
    selectedTask: any = null;
    showInfoPopup = false;
    projectUsers: ProjectUsersInterface[] = []
    isUserAdmin: boolean | undefined;
    showCommentPopup = false;
    user!: UserInterface;

    isLoadingTasks = false;
    isLoadingComments = false;
    isSubmitting = false;

    constructor(private route: ActivatedRoute, private projectService: ProjectServices, private wsService: WebSocketService, private fb: FormBuilder, private snackBar: MatSnackBar) {
        this.form = this.fb.group({
            title: ['', [Validators.required, Validators.minLength(3)]],
            description: [''],
            due_date: [''],
            assigned_to: [null]
        });
    }

    ngOnInit() {
        const userStr = localStorage.getItem('user');
        this.user = userStr ? JSON.parse(userStr) : null;
        this.routeSub = this.route.params.subscribe(params => {
            this.id = +params['id'];
            this.loadProject(this.id);

            this.checkIsUserAdmin()

            this.wsService.connect(this.id, (message) => {
                if (message.type === 'task_updated') {
                    const updated = message.task;
                    const index = this.projectTasks.findIndex(t => t.id === updated.id);
                    if (index >= 0) {
                        this.projectTasks[index] = updated;
                    } else {
                        this.projectTasks.push(updated);
                    }
                }
                if (message.type === 'new_comment') {
                    const task = this.projectTasks.find(t => t.id === message.task_id);
                    if (task) {
                        task.comments = task.comments || [];
                        task.comments.push(message.comment);

                        if (this.selectedTask?.id === task.id) {
                            this.scrollToBottom();
                        }

                        this.snackBar.open(`💬 New comment on "${task.title}"`, 'OK', {
                            duration: 3000,
                            horizontalPosition: 'right',
                            verticalPosition: 'top',
                            panelClass: ['custom-snackbar']
                        });

                    }
                }
            });
            this.projectUsers = []
            this.getProjectMembers()
        });
    }

    openCreateForm() {
        this.isEditMode = false;
        this.form.reset();
        this.showForm = true;
    }

    submit() {
        if (this.form.invalid) {
            this.form.markAllAsTouched();
            return;
        }

        this.isSubmitting = true;
        const data = { ...this.form.value, id: this.editedTaskId, project: this.id };

        const handler = () => {
            this.loadProject(this.id);
            this.resetForm();
            this.isSubmitting = false;
        };

        if (this.isEditMode) {
            this.projectService.updateTask(data).subscribe(handler, () => this.isSubmitting = false);
        } else {
            this.projectService.createTask(data).subscribe(handler, () => this.isSubmitting = false);
        }
    }


    checkIsUserAdmin() {
        this.projectService.getProjectIsAdmin(this.id).subscribe({
            next: isAdmin => {
                this.isUserAdmin = isAdmin;
            },
            error: error => {
                console.log('User is Not Admin');
            }
        })
    }

    editTask(task: TaskInterface) {
        this.isEditMode = true;
        this.editedTaskId = task.id;

        const formattedDueDate = task.due_date?.slice(0, 16) || '';
        this.form.patchValue({...task, due_date: formattedDueDate});

        this.showForm = true;
    }

    openDeleteConfirm(task: TaskInterface) {
        this.taskToDelete = task;
        this.showConfirmDelete = true;
    }

    closeConfirm() {
        this.showConfirmDelete = false;
        this.taskToDelete = null;
    }

    confirmDelete() {
        if (this.taskToDelete) {
            console.log(this.taskToDelete.id);
            this.projectService.deleteTask(this.taskToDelete.id).subscribe(() => {
                this.projectTasks = this.projectTasks.filter(t => t.id !== this.taskToDelete.id);
                this.closeConfirm();

            });
        }
    }

    taskInformation(task: TaskInterface) {
        this.selectedTask = task;
        const statusTitles: { [key: string]: string } = {
            planning: 'Planning',
            to_do: 'To Do',
            in_progress: 'In Progress',
            done: 'Done',
            finished: 'Finished'
        };

        this.selectedTask = {
            ...task,
            displayStatus: statusTitles[task.status] || task.status
        };

        this.showInfoPopup = true;
    }

    closeTaskInfo() {
        this.selectedTask = null;
        this.showInfoPopup = false;
    }

    resetForm() {
        this.form.reset();
        this.editedTaskId = null;
        this.isEditMode = false;
        this.showForm = false;
    }

    onTaskDrop(event: CdkDragDrop<any[]>, newStatus: string) {
        const task = event.item.data;

        if (task.status !== newStatus) {
            const updatedTask = {...task, status: newStatus};

            this.projectService.updateTask(updatedTask).subscribe(() => {
                task.status = newStatus;

                transferArrayItem(
                    event.previousContainer.data,
                    event.container.data,
                    event.previousIndex,
                    event.currentIndex
                );
            });
        }
    }

    getColumnTitle(status: string): string {
        const titles: any = {
            planning: 'Planning',
            to_do: 'To Do',
            in_progress: 'In Progress',
            done: 'Done',
            finished: 'Finished'
        };
        return titles[status] || status;
    }

    loadProject(id: number | undefined) {
        this.isLoadingTasks = true;

        setTimeout(() => {
            this.projectService.getProjectTasks(id).subscribe(tasks => {
                this.projectTasks = tasks.map(task => ({
                    ...task,
                    comments: task.comments ?? [],
                    newComment: ''
                }));
                this.isLoadingTasks = false;
            }, () => {
                this.isLoadingTasks = false;
            });
        }, 300); // забавяне за ефект
    }

    getTasksByStatus(status: string) {
        return this.projectTasks.filter(task => task.status === status);
    }

    getProjectMembers() {
        this.projectService.getProjectUsers(this.id).subscribe(users => {
                for (const user of users) {
                    this.projectUsers.push(user);
                }
                console.log(this.projectUsers);
            }
        )
    }


    toggleComments(task: TaskInterface) {
        this.isLoadingComments = true;

        setTimeout(() => {
            this.projectService.getComments(task.id).subscribe((comments) => {
                if (!Array.isArray(comments)) {
                    console.warn('⚠️ Очаквах масив, но получих:', comments);
                    return;
                }

                task.comments = comments.map(comment => {
                    if (typeof comment.user === 'string') {
                        try {
                            comment.user = JSON.parse(comment.user);
                        } catch (e) {
                            console.warn('⚠️ Неуспешен JSON.parse на user:', comment.user);
                            comment.user = {email: 'Unknown'};
                        }
                    }
                    return comment;
                });

                task.newComment = '';
                this.selectedTask = task;
                this.showCommentPopup = true;
                this.scrollToBottom();
                this.isLoadingComments = false;
            }, (error) => {
                console.error('❌ Грешка при зареждане на коментари:', error);
                this.isLoadingComments = false;
            });

        }, 300);
    }

    closeCommentPopup() {
        this.selectedTask = null;
        this.showCommentPopup = false;
    }


    addComment(task: TaskInterface) {
        const content = task.newComment?.trim();
        if (!content) return;

        const data = {task: task.id, content};

        this.projectService.createComment(data).subscribe(newComment => {
            task.newComment = '';
            this.wsService.send({
                type: 'new_comment',
                task_id: task.id,
                comment: newComment
            });
        });
    }

    scrollToBottom() {
        try {
            setTimeout(() => {
                this.commentListRef.nativeElement.scrollTop = this.commentListRef.nativeElement.scrollHeight;
            }, 50);
        } catch (err) {
            console.warn('⚠️ Error while scrolling', err);
        }
    }

    ngOnDestroy()
        :
        void {
        this.routeSub.unsubscribe();
        this.wsService.disconnect();
    }
}
