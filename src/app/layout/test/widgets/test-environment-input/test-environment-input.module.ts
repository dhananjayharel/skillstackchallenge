import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EnvironmentService } from '../../../../shared';
import { TestEnvironmentInputComponent } from './test-environment-input.component';
import { SearchenvironmentpipePipe } from './searchenvironmentpipe.pipe';
import { FormsModule } from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    FormsModule
  ],
  declarations: [TestEnvironmentInputComponent, SearchenvironmentpipePipe],
  providers: [EnvironmentService],
  exports: [TestEnvironmentInputComponent, SearchenvironmentpipePipe]
})
export class TestEnvironmentInputModule { }
