import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EqualValidator } from './equal-validator.directive';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [EqualValidator],
  exports: [EqualValidator],
})
export class ValidatorModule { }
