import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { NotFoundComponent } from './not-found.component';
import { NotFoundRoutingModule } from './not-found-routing.module';
import {LogoModule} from '../shared/components/logo/logo.module';
import {CenterpagecontentModule} from '../shared/components/centerpagecontent/centerpagecontent.module'

@NgModule({
    imports: [
        NotFoundRoutingModule,
        RouterModule,
        CenterpagecontentModule,
        LogoModule
    ],
    declarations: [NotFoundComponent]
})
export class NotFoundModule {}
