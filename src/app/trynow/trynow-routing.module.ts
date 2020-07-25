import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {TryNowComponent} from './trynow.component';

const routes: Routes = [
  {path: '', component: TryNowComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TryNowRoutingModule {
}
