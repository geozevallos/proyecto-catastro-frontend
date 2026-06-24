import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { DashboardLayoutComponent } from './layout/dashboard-layout/dashboard-layout.component';
import { LoginComponent } from './features/login/login.component';
import { RegisterComponent } from './features/register/register.component';
import { DashboardComponent } from './features/dashboard/dashboard.component';
import { PropietariosComponent } from './features/propietarios/propietarios.component';
import { LotesComponent } from './features/lotes/lotes.component';
import { MapaComponent } from './features/mapa/mapa.component';

export const routes: Routes = [
  {
    path: 'register',
    component: RegisterComponent
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: '',
    component: DashboardLayoutComponent,
    canActivate: [authGuard],
    children: [
      {
        path: 'dashboard',
        component: DashboardComponent
      },
      {
        path: 'propietarios',
        component: PropietariosComponent
      },
      {
        path: 'lotes',
        component: LotesComponent
      },
      {
        path: 'mapa',
        component: MapaComponent
      },
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '**',
    redirectTo: 'login'
  }
];
