import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ClonetestComponent } from './clonetest.component';
import { OnlineTestService } from './../../../../shared';
import { ClonetestRoutingModule} from './clonetest-routing.module';
import { TestInputModule} from '../../widgets/test-test-input/test-test-input.module';
import { PageHeaderModule } from './../../../../shared';

@NgModule({
  imports: [
    CommonModule,
    ClonetestRoutingModule,
    PageHeaderModule,
    FormsModule,
    ReactiveFormsModule,
    TestInputModule
  ],
  declarations: [ClonetestComponent],
  providers: [ OnlineTestService]
})
export class ClonetestModule { }
