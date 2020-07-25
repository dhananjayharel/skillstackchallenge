import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import {QuizModule} from '../../../../shared/components/ng2Quiz/quiz/quiz.module';
import { PushNotificationService } from '../../../../shared';
import { OnlineTestCandidiateComponent} from './onlinetestcandidiate.component';
import { LaunchMachineWidgetModule } from '../../../../shared/components/launchmachinewidget/launchmachinewidget.module';
import { Diff2HTMLModule } from '../../../../shared/components/diff2htmlrenderer/diff2htmlrenderer.module';
import { VimeoPlayerModule } from '../../../../shared/components/vimeoplayer/vimeoplayer.module';
import { SocketIoModule, SocketIoConfig } from 'ng-socket-io';
import { NgCircleProgressModule } from 'ng-circle-progress';
import { TimelineComponent } from './timeline/timeline.component';
import { SharedPipesModule } from '../../../../shared/pipes/shared-pipes.module';

const config: SocketIoConfig = { url: 'https://www.skillstack.com:3002', options: {secure: true, port: 3002} };

@NgModule({
  imports: [
    CommonModule,
    LaunchMachineWidgetModule,
    Diff2HTMLModule,
    VimeoPlayerModule,
    QuizModule,
    SocketIoModule.forRoot(config),
    NgCircleProgressModule.forRoot({
      // set defaults here
      radius: 100,
      outerStrokeWidth: 16,
      innerStrokeWidth: 8,
      outerStrokeColor: "#78C000",
      innerStrokeColor: "#C7E596",
      animationDuration: 300,
    }),
    SharedPipesModule
  ],
  declarations: [
    OnlineTestCandidiateComponent, TimelineComponent
    ],
  exports: [
    OnlineTestCandidiateComponent
  ],
  providers: [PushNotificationService]
  // providers: [OnlineTestService, CandidateService, EnvironmentService, AwsService]
})
export class OnlineTestCandidiateModule { }
