import { Routes } from '@angular/router';
import { ErrorPageComponent } from './component/error-page/error-page.component';
import { DashboardComponent } from './component/dashboard/dashboard.component';
import { SignupComponent } from './component/signup/signup.component';
import { LoginComponent } from './component/login/login.component';
import { AppComponent } from './app.component';
import { HomeComponent } from './component/home/home.component';

export const routes: Routes = [
     {
    path: '',
    component: HomeComponent
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'signup',
    component: SignupComponent,
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
  },
  {
    path: '**',
    component: ErrorPageComponent
  }
];


