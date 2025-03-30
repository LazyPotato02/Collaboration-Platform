import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import {Router, RouterLink} from '@angular/router';
import { NgIf } from '@angular/common';
import {AuthService} from '../services/auth.services';

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [ReactiveFormsModule, NgIf, RouterLink],
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css']
})
export class LoginComponent {
    loginForm: FormGroup;
    errorMessage = '';

    constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {
        this.loginForm = this.fb.group({
            email: ['', [Validators.required]],
            password: ['', [Validators.required]]
        });
    }

    login() {
        if (this.loginForm.valid) {
            const { email, password } = this.loginForm.value;
            this.authService.login(email, password).subscribe({
                next: (tokens) => {
                    localStorage.setItem('access_token', tokens.access);
                    localStorage.setItem('refresh_token', tokens.refresh);

                    this.authService.getCurrentUser().subscribe({
                        next: (user) => {
                            localStorage.setItem('user', JSON.stringify(user));
                            this.router.navigate(['/']);
                            window.location.reload();
                        },
                        error: (error) => {
                            console.error('Failed to fetch user data:', error);
                        }
                    });
                },
                error: (error) => {
                    if (error.status === 401) {
                        this.errorMessage = 'Invalid email or password';
                    } else {
                        this.errorMessage = 'Login failed. Please try again.';
                    }
                }
            });
        } else {
            this.errorMessage = 'Please enter your email and password';
        }
    }

}
