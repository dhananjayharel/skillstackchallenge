import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ConfirmAccountComponent } from './confirm-account.component';

const routes: Routes = [
    { path: '', component: ConfirmAccountComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ConfirmAccountRoutingModule { }
