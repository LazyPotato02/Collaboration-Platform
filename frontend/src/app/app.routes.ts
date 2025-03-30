import { Routes } from '@angular/router';
import {LoginComponent} from './auth/login/login.component';
import {AuthGuard, GuestGuard} from './auth/guards/auth.guard';
import {RegisterComponent} from './auth/register/register.component';

export const routes: Routes = [
    { path: 'login', component: LoginComponent, canActivate: [GuestGuard] },
    { path: 'register', component: RegisterComponent, canActivate: [GuestGuard] },
];
