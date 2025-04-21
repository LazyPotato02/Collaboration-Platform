// home.component.ts
import {Component} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterLink} from '@angular/router';
import {AuthService} from '../auth/services/auth.services';

@Component({
    selector: 'app-home',
    standalone: true,
    imports: [CommonModule, RouterLink],
    styleUrls: ['./home.component.css'],
    templateUrl: './home.component.html',

})
export class HomeComponent {
    isAuthenticated:boolean = false;
    constructor(public authService: AuthService) {}
    ngOnInit() {
        this.isAuthenticated = !this.isLoggedIn()
    }
    isLoggedIn(): boolean {
        return this.authService.isAuthenticated()
    }

}
