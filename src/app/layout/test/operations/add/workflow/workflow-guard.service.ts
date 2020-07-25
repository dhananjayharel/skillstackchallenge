import { Injectable } from '@angular/core';
import {
    CanActivate, Router,
    ActivatedRouteSnapshot,
    RouterStateSnapshot,
    CanLoad, Route
} from '@angular/router';

import { WorkflowService } from './workflow.service';

@Injectable()
export class WorkflowGuard implements CanActivate {
    constructor(private router: Router, private workflowService: WorkflowService) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
        let path: string = route.routeConfig.path;

        const _id = route.parent.params['id'];
        console.log('authguard call');
        if(_id) {
            this.workflowService.setEditId(_id);
            this.workflowService.setMode('EDIT');
            return true;
        }

        return this.verifyWorkFlow(path);
    }

    verifyWorkFlow(path) : boolean {

        // If any of the previous steps is invalid, go back to the first invalid step
        let firstPath = this.workflowService.getFirstInvalidStep(path);
        if (firstPath.length > 0) {
            console.log("Redirected to '" + firstPath + "' path which it is the first invalid step.");
            let url = `/${firstPath}`;
            this.router.navigate(['test/add' + url]);
            return false;
        };

        return true;
    }
}


