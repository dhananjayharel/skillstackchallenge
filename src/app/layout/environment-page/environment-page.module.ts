import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { EnvironmentPageRoutingModule } from './environment-page-routing.module';
import { EnvironementPageComponent } from './environment-page.component';
import { PageHeaderModule } from './../../shared';
import { EnvironmentService } from '../../shared';


@NgModule({
  imports: [
    CommonModule,
    EnvironmentPageRoutingModule,
    PageHeaderModule,
    NgbModule.forRoot(),
  ],
  declarations: [EnvironementPageComponent],
  providers: [EnvironmentService]
})
export class EnvironmentPageModule { }
