import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import {Router, RouterLink} from '@angular/router';
import { NgIf } from '@angular/common';
import {AuthService} from '../services/auth.services';

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
            password: ['', [Validators.required, Validators.minLength(6)]]
        });
    }

    register() {
        if (this.registerForm.valid) {
            this.authService.register(
                this.registerForm.value.email,
                this.registerForm.value.password
            ).subscribe({
                next: (response) => {
                    this.message = "Registration successful!";
                    localStorage.setItem('access_token', response.access);
                    localStorage.setItem('refresh_token', response.refresh);
                    localStorage.setItem('user', JSON.stringify(response.user));
                    this.router.navigate(['/login']);
                    window.location.reload();

                },
                error: (err) => {
                    this.errorMessage = err.error?.message || 'Registration failed';
                }
            });
        } else {
            this.errorMessage = 'Please fill in all fields correctly.';
        }
    }
}
