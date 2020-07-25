import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {LogoModule} from '../shared/components/logo/logo.module';
import { CandidateService } from '../shared/services/index';
import { EnrollChallengeComponent } from './enrollchallenge.component';
import {EnrollChallengeRoutingModule } from './enrollchallenge-routing.module';

@NgModule({
  imports: [
    CommonModule,
    LogoModule,
    EnrollChallengeRoutingModule
  ],
  declarations: [ EnrollChallengeComponent ],
  providers: [
    CandidateService
  ]
})
export class EnrollChallengeModule { }
