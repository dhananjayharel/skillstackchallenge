import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import {ReactiveFormsModule} from "@angular/forms";
import { ForgotPasswordRoutingModule } from './forgot-password-routing.module';
import { ForgotPasswordComponent } from './forgot-password.component';
import {  AuthenticationService, UserService } from '../shared/services/index';
import {LogoModule} from '../shared/components/logo/logo.module';

@NgModule({
  imports: [
    CommonModule,
    ForgotPasswordRoutingModule,
    ReactiveFormsModule,
    LogoModule
  ],
  declarations: [
    ForgotPasswordComponent
    ],
  providers: [
  	
  	AuthenticationService,
  	UserService
  ]
})
export class ForgotPasswordModule { }
