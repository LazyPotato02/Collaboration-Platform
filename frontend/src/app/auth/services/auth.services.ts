import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {catchError, map, Observable, of, switchMap, throwError} from 'rxjs';


interface AuthTokens {
    access: string;
    refresh: string;
}


interface User {
    id: number;
    email: string;
}

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private apiUrl = 'http://127.0.0.1:8000';

    constructor(private http: HttpClient) {
    }

    isAuthenticated(): boolean {
        return !!this.getAccessToken();
    }

    private saveAuthData(tokens: AuthTokens, user: User): void {
        localStorage.setItem('access_token', tokens.access);
        localStorage.setItem('refresh_token', tokens.refresh);
        localStorage.setItem('user', JSON.stringify(user));
    }

    getAccessToken(): string | null {
        return localStorage.getItem('access_token');
    }

    getCurrentUser(): Observable<{ id: number; email: string; }> {
        return this.http.get<{ id: number; email: string; }>(`${this.apiUrl}/user/me`);
    }

    getRefreshToken(): string | null {
        return localStorage.getItem('refresh_token');
    }

    getUser(): User | null {
        const userData = localStorage.getItem('user');
        return userData ? JSON.parse(userData) : null;
    }

    login(email: string, password: string): Observable<{ access: string; refresh: string }> {
        return this.http.post<{ access: string; refresh: string }>(`${this.apiUrl}/api/token/`, {email, password});
    }

    register(email: string, firstName: string, lastName: string, password: string): Observable<{
        access: string;
        refresh: string;
        user: User
    }> {
        return this.http.post<{ access: string; refresh: string; user: User }>(
            `${this.apiUrl}/user/register`,
            {email, first_name: firstName, last_name: lastName, password},
            {headers: new HttpHeaders({'Content-Type': 'application/json'})}
        );
    }

    refreshToken(): Observable<string> {
        const refresh = this.getRefreshToken();
        if (!refresh) return throwError(() => new Error('No refresh token available'));

        return this.http.post<{ access: string }>(`${this.apiUrl}/api/token/refresh/`, {refresh}).pipe(
            switchMap(response => {
                const user = this.getUser();
                if (!user) {
                    return throwError(() => new Error('No user data available'));
                }

                this.saveAuthData({access: response.access, refresh}, user);

                return of(response.access);
            }),
            catchError((error) => {
                this.logout();
                return throwError(() => error);
            })
        );
    }

    logout(): void {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('user');
        window.location.href = '/login';
    }



}
