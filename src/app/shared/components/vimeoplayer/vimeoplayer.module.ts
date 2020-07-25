import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VimeoPlayerComponent } from './vimeoplayer.component';

@NgModule({
  imports: [
    CommonModule,
  ],
  declarations: [VimeoPlayerComponent],
  exports: [VimeoPlayerComponent],
})
export class VimeoPlayerModule { }
