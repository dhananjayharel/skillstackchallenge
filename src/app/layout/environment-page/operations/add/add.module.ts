import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { EnvironmentService,AwsService } from './../../../../shared';
import { AddPageRoutingModule } from './add-routing.module';
import { AddComponent } from './add.component';
import { PageHeaderModule } from './../../../../shared';
import {ReactiveFormsModule} from "@angular/forms";
// import { BrowserAnimationsModule } from '@angular/platform-browser/animations'; 
import { TagInputModule } from 'ngx-chips';

@NgModule({
  imports: [
    CommonModule,
    AddPageRoutingModule,
    PageHeaderModule,
    NgbModule.forRoot(),
    ReactiveFormsModule,
    // BrowserAnimationsModule,
    TagInputModule
  ],  declarations: [AddComponent],
  providers:[EnvironmentService, AwsService]
})
export class AddEnvironmentPageModule { }
