import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LaunchMachineWidgetComponent } from './launchmachinewidget.component';
import { EnvironmentService, AwsService, TempInstanceService } from '../../../shared';
import {CountDownModule} from '../../../shared/components/countdown/countdown.module';
import { SharedPipesModule } from '../../../shared/pipes/shared-pipes.module';

@NgModule({
  imports: [
    CommonModule,
    CountDownModule,
    SharedPipesModule
  ],
  declarations: [LaunchMachineWidgetComponent],
  exports: [LaunchMachineWidgetComponent],
  providers: [ EnvironmentService, AwsService, TempInstanceService]
})
export class LaunchMachineWidgetModule { }
