import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfirmAccountComponent } from './confirm-account.component';
import { ConfirmAccountRoutingModule } from './confirm-account-routing.module'
import {LogoModule} from '../shared/components/logo/logo.module';
import {  AuthenticationService } from '../shared/services/index';

@NgModule({
  imports: [
    CommonModule,
    LogoModule,
    ConfirmAccountRoutingModule
  ],
  declarations: [
    ConfirmAccountComponent
    ],
  providers: [
    AuthenticationService
  ]
})
export class ConfirmAccountModule { }
