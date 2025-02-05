import { Routes } from '@angular/router';
import { AuthGuard } from './auth.guard';
import { LoginComponent } from './login/login.component';

export const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  {
    path: 'dashboard',
    loadComponent: () => import('./dashboard/dashboard.component')
      .then(m => m.DashboardComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'scan',
    loadComponent: () => import('./scan/scan.component')
      .then(m => m.ScanComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'history',
    loadComponent: () => import('./history/history.component')
      .then(m => m.HistoryComponent),
    canActivate: [AuthGuard]
  }
];
