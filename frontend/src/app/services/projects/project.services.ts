import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {ProjectInterface} from '../../interfaces/project.interface';
import {ProjectUsersInterface, UserInterface} from '../../interfaces/user.interface';
import {TaskInterface} from '../../interfaces/task.interface';

@Injectable({
    providedIn: 'root'
})
export class ProjectServices {
    apiUrlProjects: string = 'http://localhost:8000/project';
    apiUrlTasks: string = 'http://localhost:8000/task';
    apiUrlComment: string = 'http://localhost:8000/comment';
    apiUrlUsers: string = 'http://localhost:8000/user';

    constructor(private http: HttpClient) {
    }


    getProjects(): Observable<any[]> {
        return this.http.get<ProjectInterface[]>(this.apiUrlProjects);
    }

    createProject(data: { name: string, description: string }) {
        return this.http.post<ProjectInterface>(`${this.apiUrlProjects}/`, data);
    }

    getProjectUsers(projectId: number | undefined): Observable<any[]> {
        return this.http.get<ProjectUsersInterface[]>(`${this.apiUrlProjects}/users/${projectId}`, {withCredentials: true});
    }

    getAllUsers() {
        return this.http.get<UserInterface[]>(`${this.apiUrlUsers}` + '/all', {withCredentials: true});
    }

    addUserToProject(projectId: number, userId: number, role: string) {
        return this.http.post(`${this.apiUrlProjects}/add/${projectId}/members/`, {user_id: userId, role: role});
    }
    removeUserFromProject(projectId: number, userId: number) {
        return this.http.request('delete', `${this.apiUrlProjects}/add/${projectId}/members/`, {
            body: { user_id: userId }
        });
    }
    getProjectTasks(projectId: number | undefined) {
        return this.http.get<TaskInterface[]>(this.apiUrlTasks + `/project/${projectId}`)
    }

    getProjectIsAdmin(projectId: number | undefined) {
        return this.http.get<boolean>(`${this.apiUrlProjects}/isAdmin/${projectId}`);
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
