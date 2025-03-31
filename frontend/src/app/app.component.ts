import { Component } from '@angular/core';
import {Router, RouterLink, RouterOutlet} from '@angular/router';
import {NgForOf, NgIf} from '@angular/common';
import {AuthService} from './auth/services/auth.services';
import {ProjectServices} from './services/projects/project.services.service';

@Component({
  selector: 'app-root',
    imports: [RouterOutlet, RouterLink, NgIf, NgForOf],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
    projects: any[] = []


    get isLoggedIn(): boolean {
        return this.authService.isAuthenticated();
    }
    constructor(private authService: AuthService,private projectService: ProjectServices, private router: Router) {}

    ngOnInit(): void {
        this.projectService.getProjects().subscribe({
            next: (data) => {
                this.projects = data;
            },
            error: (err) => {
                console.error('Error loading projects:', err);
            }
        });
    }

    logout(): void {
        this.authService.logout();
        this.router.navigate(['/login']);
    }
}
