import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LayoutComponent } from './layout.component';

const routes: Routes = [
    {
        path: '', component: LayoutComponent,
        children: [
            { path: 'dashboard', loadChildren: './dashboard/dashboard.module#DashboardModule' },
            { path: 'blank-page', loadChildren: './blank-page/blank-page.module#BlankPageModule' },
            { path: 'test', loadChildren: './test/test-page.module#TestPageModule' },
            { path: 'test/view/:testid', loadChildren: './test/test-page.module#TestPageModule' },
            { path: 'test/clone', loadChildren: './test/operations/clonetest/clonetest.module#ClonetestModule' },
            { path: 'test/add', loadChildren: './test/operations/add/add.module#AddOnlineTestPageModule' },
            { path: 'test/edit/:id', loadChildren: './test/operations/add/add.module#AddOnlineTestPageModule' },
            // { path: 'onlinetest', loadChildren: './onlinetest-page/onlinetest-page.module#OnlineTestPageModule' },
            // { path: 'onlinetest/view/:id', loadChildren: './onlinetest-page/operations/view/view.module#ViewOnlineTestPageModule' },
            { path: 'environment', loadChildren: './environment/environment-page.module#EnvironmentPageModule' },
            { path: 'environment/add', loadChildren: './environment-page/operations/add/add.module#AddEnvironmentPageModule' },
            { path: 'environment/edit/:id', loadChildren: './environment-page/operations/add/add.module#AddEnvironmentPageModule' },
            { path: 'environment/view', loadChildren: './environment-page/operations/view/view.module#ViewEnvironmentPageModule' },
            { path: 'profile', loadChildren: './profile/profile.module#ProfileModule' },
           // { path: 'buy-plan/:id', loadChildren: './buy-plan/buy-plan.module#BuyPlanModule' },
            { path: 'price-plan', loadChildren: './price-plan/price-plan.module#PricePlanModule' },
            { path: 'admin', loadChildren: './admin/admin.module#AdminModule' }        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class LayoutRoutingModule { }
