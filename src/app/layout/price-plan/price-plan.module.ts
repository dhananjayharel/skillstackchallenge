import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PricePlanRoutingModule } from './price-plan-routing.module';
import { PricePlanComponent } from './price-plan.component';

@NgModule({
  imports: [
    CommonModule,
    PricePlanRoutingModule
  ],
  declarations: [PricePlanComponent]
})
export class PricePlanModule { }
