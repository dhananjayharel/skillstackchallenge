import {
    NgModule
} from '@angular/core';
import {
    Routes,
    RouterModule
} from '@angular/router';

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

import {
    WorkflowGuard
} from './workflow/workflow-guard.service';
import {
    WorkflowService
} from './workflow/workflow.service';


export const appRoutes: Routes = [
    // 1st Route
    {
        path: 'welcome',
        component: WelcomeComponent
    },
    // 1st Route
    {
        path: 'mcqtest',
        component: MCQComponent,
        canActivate: [WorkflowGuard]
    },
    // 2nd Route
    {
        path: 'codetest',
        component: CodeComponent,
        canActivate: [WorkflowGuard]
    },
    // 3rd Route
    {
        path: 'videotest',
        component: VideoComponent,
        canActivate: [WorkflowGuard]
    },
    // 4th Route
    {
        path: 'result',
        component: ResultComponent,
        canActivate: [WorkflowGuard]
    },
    // 5th Route
    {
        path: '',
        redirectTo: '/candidate/test/welcome',
        pathMatch: 'full'
    },
    // 6th Route
    {
        path: '**',
        component: WelcomeComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(appRoutes)],
    exports: [RouterModule],
    providers: [WorkflowGuard]
})

export class CandidatetestRoutingModule {}
