import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PendingChangesGuard } from '../../../../shared/guard/pendingchanges.guard';
import { ClonetestComponent } from './clonetest.component';

const routes: Routes = [
    { path: '', component: ClonetestComponent, canDeactivate: [PendingChangesGuard] }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ClonetestRoutingModule { }
