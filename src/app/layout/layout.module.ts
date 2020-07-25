import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { LayoutRoutingModule } from './layout-routing.module';
import { LayoutComponent } from './layout.component';
import { HeaderComponent, SidebarComponent } from '../shared';
import {LogoModule} from '../shared/components/logo/logo.module';
import { UserService } from '../shared';
@NgModule({
    imports: [
        CommonModule,
        NgbModule.forRoot(),
        LayoutRoutingModule,
        TranslateModule,
        LogoModule
    ],
    declarations: [
        LayoutComponent,
        HeaderComponent,
        SidebarComponent
    ],
    providers: [
        UserService
    ]
})
export class LayoutModule { }
