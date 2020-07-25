import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Diff2HTMLComponent } from './diff2htmlrenderer.component';
import { Diff2HTMLService } from '../../../shared';

@NgModule({
  imports: [
    CommonModule,
  ],
  declarations: [Diff2HTMLComponent],
  exports: [Diff2HTMLComponent],
  providers: [ Diff2HTMLService ]
})
export class Diff2HTMLModule { }
