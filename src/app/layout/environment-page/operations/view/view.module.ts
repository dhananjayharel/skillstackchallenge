import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ViewPageRoutingModule } from './view-routing.module';
import { ViewComponent } from './view.component';
import { PageHeaderModule } from './../../../../shared';
import { EnvironmentService,AwsService } from '../../../../shared';
import {CountDownModule} from '../../../../shared/components/countdown/countdown.module';
@NgModule({
  imports: [
    CountDownModule,
    CommonModule,
    ViewPageRoutingModule,
    PageHeaderModule,
    NgbModule.forRoot(),
  ],
  declarations: [ViewComponent
                            ],
  providers: [EnvironmentService, AwsService]
})
export class ViewEnvironmentPageModule { }
