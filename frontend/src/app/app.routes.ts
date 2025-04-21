import {Routes} from '@angular/router';
import {LoginComponent} from './auth/login/login.component';
import {AuthGuard, GuestGuard} from './auth/guards/auth.guard';
import {RegisterComponent} from './auth/register/register.component';
import {ProjectsComponent} from './projects/projects.component';
import {projectMemberGuard} from './guards/project-member.guard';
import {AboutComponent} from './about/about.component';
import {HomeComponent} from './home/home.component';
import {PageNotFoundComponent} from './page-not-found/page-not-found.component';

export const routes: Routes = [
    {path: '', component: HomeComponent },
    {path: 'about', component: AboutComponent},
    {path: 'login', component: LoginComponent, canActivate: [GuestGuard]},
    {path: 'register', component: RegisterComponent, canActivate: [GuestGuard]},
    {path: 'projects/:id', component: ProjectsComponent, canActivate: [AuthGuard,projectMemberGuard]},

    { path: '**', component: PageNotFoundComponent }
];
