import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { EnvironmentPageRoutingModule } from './environment-page-routing.module';
import { EnvironmentPageComponent } from './environment-page.component';
import { PageHeaderModule } from './../../shared';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { EnvironmentDescriptionComponent } from './widgets/environment-description/environment-description.component';
import { EnvironmentSidebarComponent } from './widgets/environment-sidebar/environment-sidebar.component';
import { EnvironmentFilterComponent } from './widgets/environment-filter/environment-filter.component';
import { CandidateService, EnvironmentService, AwsService } from '../../shared';
import {CountDownModule} from '../../shared/components/countdown/countdown.module';

@NgModule({
  imports: [
    CommonModule,
    EnvironmentPageRoutingModule,
    PageHeaderModule,
    NgbModule.forRoot(),
    FormsModule,
    ReactiveFormsModule
  ],
  declarations: [EnvironmentPageComponent, 
    EnvironmentDescriptionComponent, 
    EnvironmentSidebarComponent, 
    EnvironmentFilterComponent],
  providers: [EnvironmentService]
})
export class EnvironmentPageModule { }
