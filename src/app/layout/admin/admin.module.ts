import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import {ReactiveFormsModule} from "@angular/forms";
import { AdminRoutingModule } from './admin-routing.module';
import { AdminComponent } from './admin.component';
import { PageHeaderModule } from './../../shared';
import {  AuthenticationService, UserService,CandidateService} from '../../shared/services/index';

@NgModule({
  imports: [
    CommonModule,
    AdminRoutingModule,
    PageHeaderModule,
    ReactiveFormsModule,
    NgbModule.forRoot()
  ],
  declarations: [
    AdminComponent
    ],
  providers: [
    AuthenticationService,
    UserService,
	CandidateService
  ]
})
export class AdminModule { }
