import {Component} from '@angular/core';
import {Router, RouterLink, RouterOutlet} from '@angular/router';
import {NgForOf, NgIf} from '@angular/common';
import {AuthService} from './auth/services/auth.services';
import {ProjectServices} from './services/projects/project.services';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {ProjectInterface} from './interfaces/project.interface';

@Component({
    selector: 'app-root',
    imports: [RouterOutlet, RouterLink, NgIf, NgForOf, ReactiveFormsModule],
    templateUrl: './app.component.html',
    styleUrl: './app.component.css'
})
export class AppComponent {
    projects: ProjectInterface[] = []
    isCreateProjectFormShow: boolean = false;
    form: FormGroup;
    showMobileSidebar = false;
    get isLoggedIn(): boolean {
        return this.authService.isAuthenticated();
    }

    constructor(private authService: AuthService, private projectService: ProjectServices, private router: Router, private fb: FormBuilder) {
        this.form = this.fb.group({
            name: ['', [Validators.required, Validators.minLength(5)]],
            description: ['', [Validators.required, Validators.minLength(20)]],
        });
    }

    ngOnInit(): void {
        if (this.isLoggedIn) {
            this.loadProjects();
        }

    }
    loadProjects(): void {
        this.projectService.getProjects().subscribe({
            next: (data) => {
                this.projects = data;
            },
            error: (err) => {
                console.error('Error loading projects:', err);
            }
        });
    }
    changeCreateProjectFormShow(): void {
        this.isCreateProjectFormShow = true;
    }

    close() {
        this.isCreateProjectFormShow = false;

    }

    submit() {
        if (this.form.invalid) {
            this.form.markAllAsTouched();
            return;
        }
        const data = this.form.value;

        this.projectService.createProject(data).subscribe({
            next: (data) => {
                this.loadProjects();
                this.form.reset();
                this.close();
            }, error: (err) => {
                console.log(err);
            }

        })
    }
    toggleSidebar() {
        this.showMobileSidebar = !this.showMobileSidebar;
    }
    logout(): void {
        this.authService.logout();
        this.router.navigate(['/login']);
    }
}
