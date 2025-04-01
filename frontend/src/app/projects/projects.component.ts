import {Component} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Observable, Subscription} from 'rxjs';
import {ProjectServices} from '../services/projects/project.services.service';
import {NgForOf} from '@angular/common';

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
    projectTasks: any[]| undefined;
    private routeSub!: Subscription;

    constructor(private route: ActivatedRoute, private projectService: ProjectServices) {
    }

    ngOnInit() {
        this.routeSub = this.route.params.subscribe(params => {
            this.id = +params['id'];
            this.loadProject(this.id);
        });
    }

    loadProject(id: number | undefined) {
        this.projectService.getProjectTasks(id).subscribe(tasks => {
            this.projectTasks = tasks
            console.log(this.projectTasks);
        })
    }

    ngOnDestroy(): void {
        this.routeSub.unsubscribe();
    }
}
