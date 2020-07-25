import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import {ReactiveFormsModule} from '@angular/forms';
import { ResetPasswordRoutingModule } from './reset-password-routing.module';
import { ResetPasswordComponent } from './reset-password.component';
import { ValidatorModule } from '../shared/validators/validator.module';
import {LogoModule} from '../shared/components/logo/logo.module';
import {  AuthenticationService, UserService } from '../shared/services/index';

@NgModule({
  imports: [
    CommonModule,
    ResetPasswordRoutingModule,
    ReactiveFormsModule,
    LogoModule,
    ValidatorModule
  ],
  declarations: [
    ResetPasswordComponent
    ],
  providers: [
    AuthenticationService,
    UserService
  ]
})
export class ResetPasswordModule { }
