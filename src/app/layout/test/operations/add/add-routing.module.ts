import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AddComponent } from './add.component';
import { BasicTabComponent }    from './basic/basictab.component';
import { WorkflowGuard }        from './workflow/workflow-guard.service';
import { WorkflowService }      from './workflow/workflow.service';
import { PendingChangesGuard } from '../../../../shared/guard/pendingchanges.guard';
const routes: Routes = [
	{ path: '', component: AddComponent,
		children: [
			 // 1st Route
		    { path: 'basic',  component: BasicTabComponent, canActivate: [WorkflowGuard], canDeactivate: [PendingChangesGuard] },
		    // 6th Route
		    { path: '**', component: BasicTabComponent, canActivate: [WorkflowGuard], canDeactivate: [PendingChangesGuard] }
		],
	},
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
    providers: [WorkflowGuard]
})
export class AddPageRoutingModule { }
