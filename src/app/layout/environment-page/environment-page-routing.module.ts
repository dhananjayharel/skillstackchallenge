import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EnvironementPageComponent } from './environment-page.component';

const routes: Routes = [
    { path: '', component: EnvironementPageComponent }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class EnvironmentPageRoutingModule { }
