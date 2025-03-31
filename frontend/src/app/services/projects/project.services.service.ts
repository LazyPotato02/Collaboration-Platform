import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProjectServices {
    apiUrl: string = 'http://localhost:8000/project';
    constructor(private http: HttpClient) {
    }

    getProjects(): Observable<any[]> {
        return this.http.get<any[]>(this.apiUrl);
    }
}
