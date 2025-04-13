import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class ProjectServices {
    apiUrlProjects: string = 'http://localhost:8000/project';
    apiUrlTasks: string = 'http://localhost:8000/task';
    apiUrlComment: string = 'http://localhost:8000/comment';

    constructor(private http: HttpClient) {
    }


    getProjects(): Observable<any[]> {
        return this.http.get<any[]>(this.apiUrlProjects);
    }

    createProject(data: { name: string, description: string }) {
        return this.http.post<any>(`${this.apiUrlProjects}/`, data);
    }

    getProjectUsers(projectId: number | undefined): Observable<any[]> {
        return this.http.get<any[]>(`${this.apiUrlProjects}/users/${projectId}`, {withCredentials: true});
    }

    getProjectTasks(projectId: number | undefined) {
        return this.http.get<any[]>(this.apiUrlTasks + `/project/${projectId}`)
    }
    getProjectIsAdmin(projectId: number | undefined) {
        return this.http.get<any[]>(`${this.apiUrlProjects}/isAdmin/${projectId}`);
    }
    getComments(taskId: number) {
        return this.http.get(`${this.apiUrlComment}/${taskId}`);
    }

    createComment(data: any) {
        return this.http.post(`${this.apiUrlComment}/`, data);
    }
    createTask(data: any): Observable<any> {
        return this.http.post<any>(`${this.apiUrlTasks}/`, data, {withCredentials: true});
    }

    updateTask(task: any): Observable<any> {
        return this.http.patch<any>(`${this.apiUrlTasks}/project/${task.id}/`, task, {withCredentials: true});
    }

    deleteTask(taskId: number): Observable<any> {
        return this.http.request<any>('delete', `${this.apiUrlTasks}/project/${taskId}/`, {withCredentials: true,});
    }
}
