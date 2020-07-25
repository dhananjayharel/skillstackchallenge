import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CenterpagecontentComponent } from './centerpagecontent/centerpagecontent.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [CenterpagecontentComponent],
  exports: [
  	CenterpagecontentComponent
  ]
})
export class CenterpagecontentModule { }
