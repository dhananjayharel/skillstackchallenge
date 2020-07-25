import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CandidateService, UserService } from '../../../../shared';
import { OnlineTestCandidiateFormComponent} from './onlinetestcandidiateform.component';
import { FormsModule, ReactiveFormsModule} from '@angular/forms';
import { TinymceModule } from 'ng2-tinymce-alt';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TinymceModule.withConfig({
      plugins: ['lists', 'code'],
      statusbar: false,
      menubar: false
    }),
  ],
  declarations: [
    OnlineTestCandidiateFormComponent
    ],
  exports: [
    OnlineTestCandidiateFormComponent
  ],
  providers: [CandidateService, UserService]
  // providers: [OnlineTestService, CandidateService, EnvironmentService, AwsService]
})
export class OnlineTestCandidiateFormModule { }
