import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AddComponent } from './add.component';
import { PendingChangesGuard } from '../../../../shared/guard/pendingchanges.guard';

const routes: Routes = [
    { path: '', component: AddComponent, canDeactivate: [PendingChangesGuard] }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class AddPageRoutingModule { }
