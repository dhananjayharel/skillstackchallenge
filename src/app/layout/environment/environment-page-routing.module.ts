import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EnvironmentPageComponent } from './environment-page.component';

const routes: Routes = [
    { path: '', component: EnvironmentPageComponent }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class EnvironmentPageRoutingModule { }
