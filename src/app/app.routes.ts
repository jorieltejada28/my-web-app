import { Routes } from '@angular/router';
import { authGuard } from './guards/auth-guard';
import { guestGuard } from './guards/guest-guard';

export const routes: Routes = [
  {
    path: 'signin',
    canActivate: [guestGuard],
    title: 'Sign In',
    loadComponent: () =>
      import('./pages/signin/signin.component').then(
        m => m.SigninComponent
      ),
  },
  {
    path: 'dashboard',
    canActivate: [authGuard],
    title: 'Dashboard',
    loadComponent: () =>
      import('./pages/dashboard/dashboard.component').then(
        m => m.DashboardComponent
      )
  },
  {
    path: 'users',
    canActivate: [authGuard],
    title: 'Users',
    loadComponent: () =>
      import('./pages/users/users.component').then(
        m => m.UsersComponent
      )
    },
  { path: '', redirectTo: 'signin', pathMatch: 'full' },
];
