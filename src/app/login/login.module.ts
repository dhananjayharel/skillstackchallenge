import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import {ReactiveFormsModule} from "@angular/forms";
import { LoginRoutingModule } from './login-routing.module';
import { LoginComponent } from './login.component';
import {LogoModule} from '../shared/components/logo/logo.module';
import {  AuthenticationService, UserService } from '../shared/services/index';

@NgModule({
  imports: [
    CommonModule,
    LoginRoutingModule,
    ReactiveFormsModule,
    LogoModule
  ],
  declarations: [
    LoginComponent
    ],
  providers: [
  	AuthenticationService,
  	UserService
  ]
})
export class LoginModule { }
