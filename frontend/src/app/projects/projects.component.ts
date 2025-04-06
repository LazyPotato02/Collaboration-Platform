import {Component} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Observable, Subscription} from 'rxjs';
import {ProjectServices} from '../services/projects/project.services.service';
import {NgForOf} from '@angular/common';
import {WebSocketService} from '../services/websocket/websocket.service';

@Component({
    selector: 'app-projects',
    imports: [
        NgForOf
    ],
    templateUrl: './projects.component.html',
    styleUrl: './projects.component.css'
})
export class ProjectsComponent {
    id: number | undefined;
    projectTasks: any[] = [];
    private routeSub!: Subscription;

    constructor(private route: ActivatedRoute, private projectService: ProjectServices,private wsService: WebSocketService) {
    }

    ngOnInit() {
        this.routeSub = this.route.params.subscribe(params => {
            this.id = +params['id'];
            this.loadProject(this.id);
        });

        this.wsService.connect(this.id, (message) => {
            if (message.type === 'task_updated') {
                const updated = message.task;

                // 🔁 Update or insert
                const index = this.projectTasks.findIndex(t => t.id === updated.id);
                if (index >= 0) {
                    this.projectTasks[index] = updated;
                } else {
                    this.projectTasks.push(updated);
                }
            }
        });
    }

    loadProject(id: number | undefined) {
        this.projectService.getProjectTasks(id).subscribe(tasks => {
            this.projectTasks = tasks
            console.log(this.projectTasks);
        })
    }
    getTasksByStatus(status: string) {
        return this.projectTasks.filter(task => task.status === status);
    }
    ngOnDestroy(): void {
        this.routeSub.unsubscribe();
    }
}
