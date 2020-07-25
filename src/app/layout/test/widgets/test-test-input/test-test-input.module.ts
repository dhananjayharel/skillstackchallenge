import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OnlineTestService } from '../../../../shared';
import { TestInputComponent } from './test-test-input.component';
import { SearchenvironmentpipePipe } from './searchenvironmentpipe.pipe';
import { FormsModule } from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    FormsModule
  ],
  declarations: [TestInputComponent, SearchenvironmentpipePipe],
  providers: [OnlineTestService],
  exports: [TestInputComponent, SearchenvironmentpipePipe]
})
export class TestInputModule { }
