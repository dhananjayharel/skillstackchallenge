import {NgModule} from "@angular/core";
import {Routes, RouterModule} from "@angular/router";
import {SelfieVideoComponent} from "./selfie-video.component";

const routes: Routes = [
  {path: '', component: SelfieVideoComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SelfieVideoRoutingModule {
}
