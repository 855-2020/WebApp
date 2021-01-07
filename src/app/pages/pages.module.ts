import { ForbiddenComponent } from './forbidden/forbidden.component';
import { AdminUsersComponent } from './admin-pages/admin-users/admin-users.component';
import { AdminSettingsComponent } from './admin-pages/admin-settings/admin-settings.component';
import { AdminModelsComponent } from './admin-pages/admin-models/admin-models.component';
import { AlertDialogComponent } from 'src/app/components/alert-dialog/alert-dialog.component';
import { SignupComponent } from './signup/signup.component';
import { LoginComponent } from './login/login.component';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home/home.component';
import { ImportsModule } from '../common/imports.module';
import { TemplateDefaultComponent } from './../templates/template-default/template-default.component';
import { SimplifiedModelComponent } from './simplified-model/simplified-model.component';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    TemplateDefaultComponent,
    HomeComponent,
    SimplifiedModelComponent,
    LoginComponent,
    SignupComponent,
    AlertDialogComponent,
    AdminModelsComponent,
    AdminSettingsComponent,
    AdminUsersComponent,
    ForbiddenComponent,
  ],
  imports: [
    CommonModule,
    ImportsModule,
    RouterModule,
  ],
  exports: [
    TemplateDefaultComponent,
    HomeComponent,
    SimplifiedModelComponent,
  ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class PagesModule { }
