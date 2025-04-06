import {Component} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Observable, Subscription} from 'rxjs';
import {ProjectServices} from '../services/projects/project.services';
import {CommonModule, NgClass, NgForOf} from '@angular/common';
import {WebSocketService} from '../services/websocket/websocket.service';
import {CdkDrag, CdkDragDrop, CdkDropList, DragDropModule, transferArrayItem} from '@angular/cdk/drag-drop';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';

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
    ],
    templateUrl: './projects.component.html',
    styleUrl: './projects.component.css'
})
export class ProjectsComponent {
    id: number | undefined;
    projectTasks: any[] = [];
    private routeSub!: Subscription;
    statuses = ['planning', 'to_do', 'in_progress', 'done', 'finished'];
    dropListIds = this.statuses.map(status => `list-${status}`);
    form: FormGroup;
    isEditMode = false;
    editedTaskId: number | null = null;

    constructor(private route: ActivatedRoute, private projectService: ProjectServices, private wsService: WebSocketService, private fb: FormBuilder,) {
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

    submit() {
        if (this.form.invalid) {
            this.form.markAllAsTouched();
            return;
        }

        const data = {...this.form.value, id: this.editedTaskId, project: this.id};

        if (this.isEditMode) {
            this.projectService.updateTask(data).subscribe(() => {
                this.loadProject(this.id); // презареди задачите
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
        this.form.patchValue(task);
    }

    deleteTask(task: any) {
        this.projectService.deleteTask(task.id).subscribe(() => {
            this.projectTasks = this.projectTasks.filter(t => t.id !== task.id);
        });
    }

    resetForm() {
        this.form.reset();
        this.isEditMode = false;
        this.editedTaskId = null;
    }

    onTaskDrop(event: CdkDragDrop<any[]>, newStatus: string) {
        const task = event.item.data;

        if (task.status !== newStatus) {
            const updatedTask = { ...task, status: newStatus };

            this.projectService.updateTask(updatedTask).subscribe(() => {
                // Обнови локалния списък с новия статус
                task.status = newStatus;

                // Премести задачата между списъците
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
