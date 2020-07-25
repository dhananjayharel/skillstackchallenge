import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TryNowComponent } from './trynow.component';
import { TryNowRoutingModule } from './trynow-routing.module';
import {LogoModule} from '../shared/components/logo/logo.module';
import {CenterpagecontentModule} from '../shared/components/centerpagecontent/centerpagecontent.module'; 

@NgModule({
    imports: [
        TryNowRoutingModule,
        RouterModule,
        CommonModule,
        LogoModule,
        CenterpagecontentModule,
        FormsModule
    ],
    declarations: [TryNowComponent],
})
export class TryNowModule {}
