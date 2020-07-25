import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TestPageRoutingModule } from './test-page-routing.module';
import { TestPageComponent } from './test-page.component';
import { PageHeaderModule } from './../../shared';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { TestDescriptionComponent } from './widgets/test-description/test-description.component';
import { TestSidebarComponent } from './widgets/test-sidebar/test-sidebar.component';
import { TestFilterComponent } from './widgets/test-filter/test-filter.component';
import { OnlineTestCandidiateModule } from './widgets/onlinetestcandidiate/onlinetestcandidiate.module';
import { OnlineTestService, CandidateService, ScriptService } from '../../shared';
import { OnlineTestCandidiateFormModule } from './widgets/onlinetestcandidiate/onlinetestcandidiateform.module';
import { CandidatestatusModule } from './widgets/onlinetestcandidiate/candidatestatus/candidatestatus.module';
import {CountDownModule} from '../../shared/components/countdown/countdown.module';
import { TinymceModule } from 'ng2-tinymce-alt';

@NgModule({
  imports: [
    CommonModule,
    TestPageRoutingModule,
    PageHeaderModule,
    NgbModule.forRoot(),
    FormsModule,
    ReactiveFormsModule,
    OnlineTestCandidiateModule,
    OnlineTestCandidiateFormModule,
    CandidatestatusModule,
	   TinymceModule.withConfig({
      plugins: ['lists', 'code'],
      statusbar: false,
      menubar: false
    })
  ],
  declarations: [TestPageComponent, TestDescriptionComponent, TestSidebarComponent, TestFilterComponent],
  providers: [OnlineTestService, CandidateService, ScriptService]
})
export class TestPageModule { }
