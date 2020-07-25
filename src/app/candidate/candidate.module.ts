import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {ReactiveFormsModule} from '@angular/forms';
import { CandidateRoutingModule } from './candidate-routing.module';
import { CandidateComponent } from './candidate.component';
import { CountDownModule } from '../shared/components/countdown/countdown.module';
import { LaunchMachineWidgetModule } from '../shared/components/launchmachinewidget/launchmachinewidget.module';
import {LogoModule} from '../shared/components/logo/logo.module';
import {QuizModule} from '../shared/components/ng2Quiz/quiz/quiz.module';
// import { SurveyModule } from './../shared/components/surveyjs/survey.module';
import {  AuthenticationService, UserService, CandidateService, EnvironmentService,
    AwsService, OnlineTestService, PushNotificationService, ScriptService } from '../shared/services/index';
import { SocketIoModule, SocketIoConfig } from 'ng-socket-io';
const config: SocketIoConfig = { url: 'https://www.skillstack.com:3002', options: {secure: true, port: 3002} };
import { SharedPipesModule } from '../shared/pipes/shared-pipes.module';

@NgModule({
  imports: [
    CommonModule,
    CandidateRoutingModule,
    ReactiveFormsModule,
    LogoModule,
    QuizModule,
    CountDownModule,
    SocketIoModule.forRoot(config),
    LaunchMachineWidgetModule,
    SharedPipesModule,
    // SurveyModule
  ],
  declarations: [
    CandidateComponent
    ],
  providers: [
    AuthenticationService,
    UserService,
    CandidateService,
    EnvironmentService,
    AwsService,
    OnlineTestService,
    PushNotificationService,
    ScriptService
  ]
})
export class CandidateModule { }
