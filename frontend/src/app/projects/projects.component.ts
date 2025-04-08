import {Component, ViewEncapsulation} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Observable, Subscription} from 'rxjs';
import {ProjectServices} from '../services/projects/project.services';
import {CommonModule, NgClass, NgForOf} from '@angular/common';
import {WebSocketService} from '../services/websocket/websocket.service';
import {CdkDrag, CdkDragDrop, CdkDropList, DragDropModule, transferArrayItem} from '@angular/cdk/drag-drop';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {MatSnackBar, MatSnackBarModule} from '@angular/material/snack-bar';

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
        MatSnackBarModule
    ],
    templateUrl: './projects.component.html',
    styleUrl: './projects.component.css',
})
export class ProjectsComponent {
    id: number | undefined;
    projectTasks: any[] = [];
    private routeSub!: Subscription;
    statuses = ['planning', 'to_do', 'in_progress', 'done'];
    dropListIds = this.statuses.map(status => `list-${status}`);
    form: FormGroup;
    isEditMode = false;
    editedTaskId: number | null = null;
    showForm = false;
    showConfirmDelete = false;
    taskToDelete: any = null;
    constructor(private route: ActivatedRoute, private projectService: ProjectServices, private wsService: WebSocketService, private fb: FormBuilder, private snackBar: MatSnackBar) {
        this.form = this.fb.group({
            title: ['', [Validators.required, Validators.minLength(3)]],
            description: [''],
            due_date: [''],
            assigned_to: [null]
        });
    }

    ngOnInit() {
        this.routeSub = this.route.params.subscribe(params => {
            this.id = +params['id'];
            this.loadProject(this.id);

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
            });
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

        const data = {...this.form.value, id: this.editedTaskId, project: this.id};

        if (this.isEditMode) {
            this.projectService.updateTask(data).subscribe(() => {
                this.loadProject(this.id);
                this.resetForm();
            });
        } else {
            this.projectService.createTask(data).subscribe(() => {
                this.loadProject(this.id);
                this.resetForm();
            });
        }
    }


    editTask(task: any) {
        this.isEditMode = true;
        this.editedTaskId = task.id;

        const formattedDueDate = task.due_date?.slice(0, 16) || '';
        this.form.patchValue({...task, due_date: formattedDueDate});

        this.showForm = true;
    }

    openDeleteConfirm(task: any) {
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
        this.projectService.getProjectTasks(id).subscribe(tasks => {
            this.projectTasks = tasks
        })
    }

    getTasksByStatus(status: string) {
        return this.projectTasks.filter(task => task.status === status);
    }

    ngOnDestroy(): void {
        this.routeSub.unsubscribe();
        this.wsService.disconnect();
    }
}
