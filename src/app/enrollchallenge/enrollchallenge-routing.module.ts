import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EnrollChallengeComponent } from './enrollchallenge.component';

const routes: Routes = [
    { path: '', component: EnrollChallengeComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EnrollChallengeRoutingModule { }
