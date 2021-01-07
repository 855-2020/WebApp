import { ForbiddenComponent } from './pages/forbidden/forbidden.component';
import { AdminUsersComponent } from './pages/admin-pages/admin-users/admin-users.component';
import { LoginComponent } from './pages/login/login.component';
import { SignupComponent } from './pages/signup/signup.component';
import { SimplifiedModelComponent } from './pages/simplified-model/simplified-model.component';
import { HomeComponent } from './pages/home/home.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdminModelsComponent } from './pages/admin-pages/admin-models/admin-models.component';
import { AdminSettingsComponent } from './pages/admin-pages/admin-settings/admin-settings.component';
import { AuthGuard } from './auth/auth.guard';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: HomeComponent
  },
  {
    path: 'simplified',
    component: SimplifiedModelComponent
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'signup',
    component: SignupComponent
  },
  {
    path: 'admin',
    children: [
      {
        path: 'users',
        component: AdminUsersComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'models',
        component: AdminModelsComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'settings',
        component: AdminSettingsComponent,
        canActivate: [AuthGuard]
      },
    ]
  },
  {
    path: 'forbidden',
    component: ForbiddenComponent
  },
  {
    path: '**',
    redirectTo: ''
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
