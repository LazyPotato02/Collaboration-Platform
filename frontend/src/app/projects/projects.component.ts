import {Component} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Subscription} from 'rxjs';
import {ProjectServices} from '../services/projects/project.services.service';

@Component({
    selector: 'app-projects',
    imports: [],
    templateUrl: './projects.component.html',
    styleUrl: './projects.component.css'
})
export class ProjectsComponent {
    id: number | undefined ;
    private routeSub!: Subscription;
    constructor(private route: ActivatedRoute,private projectService: ProjectServices) {
    }

    ngOnInit() {
        this.routeSub = this.route.params.subscribe(params => {
            this.id = +params['id'];
            this.loadProject(this.id);
        });
    }

    loadProject(id: number | undefined) {
        console.log(id)
    }
    ngOnDestroy(): void {
        this.routeSub.unsubscribe();
    }
}
