import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class ProjectServices {
    apiUrlProjects: string = 'http://localhost:8000/project';
    apiUrlTasks: string = 'http://localhost:8000/task';

    constructor(private http: HttpClient) {
    }

    getProjects(): Observable<any[]> {
        return this.http.get<any[]>(this.apiUrlProjects);
    }

    getProjectTasks(projectId: number | undefined) {
        return this.http.get<any[]>(this.apiUrlTasks + '/project/' + projectId)
    }

}
