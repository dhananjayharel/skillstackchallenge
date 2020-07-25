import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomepageComponent } from './homepage.component';
import { HomepageRoutingModule } from './homepage-routing.module';
import {LogoModule} from '../shared/components/logo/logo.module';
import { NgbModule, NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { TestimonialsComponent } from './components/testimonials/testimonials.component';
//import { HttpClient } from '@angular/common/http';
import { HowitworksComponent } from './components/howitworks/howitworks.component';

@NgModule({
  imports: [
    CommonModule,
    HomepageRoutingModule,
    LogoModule,
    NgbModule.forRoot(),
    NgbDropdownModule.forRoot(),
  ],
  declarations: [ HomepageComponent, TestimonialsComponent, HowitworksComponent ],
  //providers: [ HttpClient ]
})
export class HomepageModule { }
