import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CountDownComponent } from './countdown.component';

@NgModule({
  imports: [
    CommonModule,
  ],
  declarations: [
    CountDownComponent
    ],
  exports: [
  	CountDownComponent
  ]
})
export class CountDownModule { }