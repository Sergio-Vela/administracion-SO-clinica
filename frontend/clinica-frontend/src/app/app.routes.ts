import { Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { CitasPageComponent } from './pages/citas-page';
import { DashboardPageComponent } from './pages/dashboard-page';
import { LoginPageComponent } from './pages/login-page';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginPageComponent },
  { path: 'dashboard', component: DashboardPageComponent, canActivate: [AuthGuard] },
  { path: 'citas', component: CitasPageComponent, canActivate: [AuthGuard] },
  { path: '**', redirectTo: 'login' }
];
