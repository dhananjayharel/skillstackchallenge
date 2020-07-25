import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PricePlanComponent } from './price-plan.component';

const routes: Routes = [
  { path: '', component: PricePlanComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PricePlanRoutingModule { }
