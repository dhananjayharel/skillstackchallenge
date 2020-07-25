import {
    NgModule
} from '@angular/core';
import {
    CommonModule
} from '@angular/common';
import {
    FormsModule
} from '@angular/forms';

import {
    CandidatetestComponent
} from './candidatetest.component';
import {
    CandidatetestRoutingModule
} from './candidatetest-routing.module';
import {LogoModule} from '../shared/components/logo/logo.module';
import {QuizModule} from '../shared/components/ng2Quiz/quiz/quiz.module';

// shared component
import {
    NavbarComponent
} from './components/navbar/navbar.component';

// Page component
import {
    WelcomeComponent
} from './pages/welcome/welcome.component';
import {
    MCQComponent
} from './pages/mcq/mcq.component';
import {
    CodeComponent
} from './pages/code/code.component';
import {
    VideoComponent
} from './pages/video/video.component';
import {
    ResultComponent
} from './pages/result/result.component';


/* Shared Service */
import {
    FormDataService
} from './data/formData.service';
import {
    WorkflowService
} from './workflow/workflow.service';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        CandidatetestRoutingModule,
        LogoModule,
        QuizModule
    ],
    declarations: [
        CandidatetestComponent,
        NavbarComponent,
        WelcomeComponent,
        MCQComponent,
        CodeComponent,
        VideoComponent,
        ResultComponent
    ],
    providers: [{
            provide: FormDataService,
            useClass: FormDataService
        },
        {
            provide: WorkflowService,
            useClass: WorkflowService
        }
    ],
})
export class CandidatetestModule {}
