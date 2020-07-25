import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
    NgbCarouselModule,
    NgbAlertModule
} from '@ng-bootstrap/ng-bootstrap';


import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard.component';
import {
    TimelineComponent,
    NotificationComponent,
    ChatComponent
} from './components';
import { NgCircleProgressModule } from 'ng-circle-progress';
import { LatestcandidateComponent } from './components/latestcandidate/latestcandidate.component';
import { SummarystatsComponent } from './components/summarystats/summarystats.component';
import { UnitstatsComponent } from './components/unitstats/unitstats.component';
import {  CandidateService } from '../../shared/services/index';

@NgModule({
    imports: [
        CommonModule,
        NgbCarouselModule.forRoot(),
        NgbAlertModule.forRoot(),
        DashboardRoutingModule,
        NgCircleProgressModule.forRoot({
            // set defaults here
            radius: 30,
            outerStrokeWidth: 16,
            innerStrokeWidth: 8,
            outerStrokeColor: '#78C000',
            innerStrokeColor: '#C7E596',
            animationDuration: 300,
          })
    ],
    declarations: [
        DashboardComponent,
        TimelineComponent,
        NotificationComponent,
        ChatComponent,
        LatestcandidateComponent,
        SummarystatsComponent,
        UnitstatsComponent
    ],
    providers: [ CandidateService ]
})
export class DashboardModule { }
