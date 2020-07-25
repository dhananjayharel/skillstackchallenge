import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import {ReactiveFormsModule} from "@angular/forms";
import { ProfileRoutingModule } from './profile-routing.module';
import { ProfileComponent } from './profile.component';
import { PageHeaderModule } from './../../shared';
import {  AuthenticationService, UserService} from '../../shared/services/index';
import { UpdatepasswordComponent } from './widgets/updatepassword/updatepassword.component';

@NgModule({
  imports: [
    CommonModule,
    ProfileRoutingModule,
    PageHeaderModule,
    ReactiveFormsModule,
    NgbModule.forRoot()
  ],
  declarations: [
    ProfileComponent,
    UpdatepasswordComponent
    ],
  providers: [
    AuthenticationService,
    UserService
  ]
})
export class ProfileModule { }
