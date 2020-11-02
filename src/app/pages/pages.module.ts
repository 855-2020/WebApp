import { HomeComponent } from './home/home.component';
import { NgModule } from '@angular/core';
import { ImportsModule } from '../common/imports.module';
import { TemplateDefaultComponent } from './../templates/template-default/template-default.component';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [
    TemplateDefaultComponent,
    HomeComponent,
  ],
  imports: [
    CommonModule,
    ImportsModule,
  ],
  exports: [
    TemplateDefaultComponent,
    HomeComponent,
  ]
})
export class PagesModule { }
