import { Component } from '@angular/core';
import {Router, RouterLink, RouterOutlet} from '@angular/router';
import {NgIf} from '@angular/common';
import {AuthService} from './auth/services/auth.services';

@Component({
  selector: 'app-root',
    imports: [RouterOutlet, RouterLink, NgIf],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
    get isLoggedIn(): boolean {
        return this.authService.isAuthenticated();
    }

    constructor(private authService: AuthService, private router: Router) {}

    logout(): void {
        this.authService.logout();
        this.router.navigate(['/login']);
    }
}
