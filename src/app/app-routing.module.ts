import { ForbiddenComponent } from './pages/forbidden/forbidden.component';
import { AdminUsersComponent } from './pages/admin-pages/admin-users/admin-users.component';
import { AdminUserComponent } from './pages/admin-pages/admin-user/admin-user.component';
import { LoginComponent } from './pages/login/login.component';
import { SignupComponent } from './pages/signup/signup.component';
import { SimplifiedModelComponent } from './pages/execute-model/execute-model.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { HomeComponent } from './pages/home/home.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdminModelsComponent } from './pages/admin-pages/admin-models/admin-models.component';
import { AdminSettingsComponent } from './pages/admin-pages/admin-settings/admin-settings.component';
import { AuthGuard } from './auth/auth.guard';
import { AdminGuard } from './auth/admin.guard';
import { AdminModelComponent } from './pages/admin-pages/admin-model/admin-model.component';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: HomeComponent
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
    path: 'models',
    component: SimplifiedModelComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'profile',
    component: ProfileComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'admin',
    children: [
      {
        path: 'users',
        component: AdminUsersComponent,
        canActivate: [AdminGuard]
      },
      {
        path: 'users/create',
        component: AdminUserComponent,
        canActivate: [AdminGuard],
      },
      {
        path: 'users/:userId/edit',
        component: AdminUserComponent,
        canActivate: [AdminGuard],
      },
      {
        path: 'models',
        component: AdminModelsComponent,
        canActivate: [AdminGuard]
      },
      {
        path: 'models/create',
        component: AdminModelComponent,
        canActivate: [AdminGuard],
      },
      {
        path: 'models/:modelId/edit',
        component: AdminModelComponent,
        canActivate: [AdminGuard],
      },
      {
        path: 'settings',
        component: AdminSettingsComponent,
        canActivate: [AdminGuard]
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
