import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SelfieVideoComponent } from './selfie-video.component';
import { SelfieVideoRoutingModule } from './selfie-video-routing.module';
import {LogoModule} from '../shared/components/logo/logo.module';
import {CenterpagecontentModule} from '../shared/components/centerpagecontent/centerpagecontent.module';
import { CandidateService, OnlineTestService } from '../shared/services/index';
import { NgCircleProgressModule } from 'ng-circle-progress';

@NgModule({
    imports: [
        SelfieVideoRoutingModule,
        RouterModule,
        CommonModule,
        LogoModule,
        CenterpagecontentModule,
        FormsModule,
        NgCircleProgressModule.forRoot({
            // set defaults here
            radius: 100,
            outerStrokeWidth: 16,
            innerStrokeWidth: 8,
            outerStrokeColor: "#78C000",
            innerStrokeColor: "#C7E596",
            animationDuration: 300,
            subtitle: 'Uploaded'
          })
    ],
    declarations: [SelfieVideoComponent],
    providers: [
        CandidateService,
        OnlineTestService
    ]
})
export class SelfieVideoModule {}
