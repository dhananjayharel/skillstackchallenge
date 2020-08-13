import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { TinymceModule } from 'ng2-tinymce-alt';
import { FileUploadModule } from 'ng2-file-upload';
import { AddPageRoutingModule } from './add-routing.module';
import { AddComponent } from './add.component';
import { PageHeaderModule } from './../../../../shared';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { OnlineTestService, ScriptService } from './../../../../shared';
// import { NgJsonEditorModule } from 'ang-jsoneditor';
/* Feature Components */
import { BasicTabComponent } from './basic/basictab.component';
import { TestcaseTabComponent } from './testcase/testcasetab.component';
/* Shared Service */
import { FormDataService } from './data/formData.service';
import { WorkflowService } from './workflow/workflow.service';
import { NavbarComponent } from './navbar/navbar.component';
import { TestEnvironmentInputModule } from '../../widgets/test-environment-input/test-environment-input.module';

@NgModule({
  imports: [
    CommonModule,
    AddPageRoutingModule,
    PageHeaderModule,
    NgbModule.forRoot(),
    FormsModule,
    ReactiveFormsModule,
    FileUploadModule,
    TinymceModule.withConfig({
      plugins: ['lists', 'code'],
	  auto_focus:false,
      statusbar: false,
      menubar: false
    }),
    TestEnvironmentInputModule,
    // NgJsonEditorModule,

  ],
  declarations: [ AddComponent, NavbarComponent, BasicTabComponent,TestcaseTabComponent ],

  providers: [ OnlineTestService, ScriptService, FormDataService, WorkflowService]
})

export class AddOnlineTestPageModule { }
