import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './shared';

const routes: Routes = [
    {
        path: '',
        loadChildren: './layout/layout.module#LayoutModule',
        canActivate: [AuthGuard]
    },
    { path: 'home', loadChildren: './homepage/homepage.module#HomepageModule' },
    { path: 'trynow', loadChildren: './trynow/trynow.module#TryNowModule' },
    { path: 'candidate/enroll/:testid', loadChildren: './enrollchallenge/enrollchallenge.module#EnrollChallengeModule' },
    { path: 'candidate/invite/:id', loadChildren: './candidate/candidate.module#CandidateModule' },
    // { path: 'candidate/test/:id', loadChildren: './candidatetest/candidatetest.module#CandidatetestModule' },
    { path: 'candidate/preview/:testid/:userid', loadChildren: './candidate/candidate.module#CandidateModule' },
    { path: 'login', loadChildren: './login/login.module#LoginModule' },
    { path: 'signup', loadChildren: './signup/signup.module#SignupModule' },
    { path: 'confirm-account/:uid/:id', loadChildren: './confirm-account/confirm-account.module#ConfirmAccountModule' },
    { path: 'reset-password/:uid/:id', loadChildren: './reset-password/reset-password.module#ResetPasswordModule' },
    { path: 'forgot-password', loadChildren: './forgot-password/forgot-password.module#ForgotPasswordModule' },
    { path: 'not-found', loadChildren: './not-found/not-found.module#NotFoundModule' },
    { path: 'video-interview/:id', loadChildren: './selfie-video/selfie-video.module#SelfieVideoModule' },
    { path: 'video-interview/:id/:testid', loadChildren: './selfie-video/selfie-video.module#SelfieVideoModule' },
    // { path: 'payment-gateway', loadChildren: './payment-gateway/payment-gateway.module#PaymentGatewayModule' },
    { path: '**', redirectTo: 'not-found' }
];
 
@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
