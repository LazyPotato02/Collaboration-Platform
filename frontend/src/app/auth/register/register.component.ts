import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import {Router, RouterLink} from '@angular/router';
import { NgIf } from '@angular/common';
import {AuthService} from '../services/auth.services';
import {strongPasswordValidator} from './passwordValidator';

@Component({
    selector: 'app-register',
    standalone: true,
    imports: [ReactiveFormsModule, NgIf, RouterLink],
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.css']
})
export class RegisterComponent {
    registerForm: FormGroup;
    message = '';
    errorMessage = '';

    constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {
        this.registerForm = this.fb.group({
            email: ['', [Validators.required, Validators.email]],
            firstName: ['', [Validators.required]],
            lastName: ['', [Validators.required]],
            password: ['', [Validators.required, Validators.minLength(6),strongPasswordValidator()]]
        });
    }
    get email() {
        return this.registerForm.get('email')!;
    }

    get firstName() {
        return this.registerForm.get('firstName')!;
    }

    get lastName() {
        return this.registerForm.get('lastName')!;
    }

    get password() {
        return this.registerForm.get('password')!;
    }

    register() {
        this.errorMessage = '';

        if (this.registerForm.valid) {
            this.authService.register(
                this.email.value,
                this.firstName.value,
                this.lastName.value,
                this.password.value
            ).subscribe({
                next: (response) => {
                    localStorage.setItem('access_token', response.access);
                    localStorage.setItem('refresh_token', response.refresh);
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
                error: (err) => {
                    const errorObj = err.error;
                    if (errorObj?.email?.length > 0) {
                        this.email.setErrors({ backend: errorObj.email[0] });
                    } else {
                        this.errorMessage = errorObj?.message || 'Registration failed.';
                    }
                }
            });
        } else {
            this.errorMessage = 'Please fill in all fields correctly.';
            this.registerForm.markAllAsTouched();
        }
    }
}
