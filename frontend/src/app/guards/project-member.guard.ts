import { inject } from '@angular/core';
import { CanActivateFn, ActivatedRouteSnapshot, Router } from '@angular/router';
import { map, catchError, of, switchMap } from 'rxjs';
import {ProjectServices} from '../services/projects/project.services';

export const projectMemberGuard: CanActivateFn = (
    route: ActivatedRouteSnapshot
) => {
    const projectService = inject(ProjectServices);
    const router = inject(Router);

    const projectId =+route.paramMap.get('id')!;
    const userJson = localStorage.getItem('user');
    console.log(projectId);
    console.log(userJson);
    if (!userJson) {
        router.navigate(['/login']);
        return of(false);
    }

    const user = JSON.parse(userJson);
    const userId = user?.id;

    if (!userId) {
        router.navigate(['/login']);
        return of(false);
    }

    return projectService.getProjectUsers(Number(projectId)).pipe(
        map(users => {
            const isMember = users.some(u => u.id === userId);
            if (!isMember) {
                router.navigate(['/']);
            }
            return isMember;
        }),
        catchError(() => {
            router.navigate(['/']);
            return of(false);
        })
    );
};
