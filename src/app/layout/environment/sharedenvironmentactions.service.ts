import { Injectable } from '@angular/core';
import { Environment } from '../../../models/environment.interface';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class SharedenvironmentactionsService {
	private activeEnvironment = new Subject<Environment> ();
	private environmentList = new Subject<Environment[]> ();
	private filterData =  new Subject<any> ();
	private refreshOp =  new Subject<boolean> ();
	private showSidebar =  new Subject<boolean> ();

	// Observable string streams
	activeEnvironment$ = this.activeEnvironment.asObservable();
	environmentList$ = this.environmentList.asObservable();
	filterData$ = this.filterData.asObservable();
	refreshOp$ = this.refreshOp.asObservable();
	showSidebar$ = this.showSidebar.asObservable();

	constructor() { }

	showActiveEnvironment(data: Environment) {
		this.activeEnvironment.next(data);
	}

	updateSideBar(data: Environment[]) {
		this.environmentList.next(data);
	}

	setEnvironmentFilter(filter: any) {
		this.filterData.next(filter);
	}

	refresh() {
		this.refreshOp.next(true)
	}

	setSidebarVisibility( op: boolean){
		this.showSidebar.next(op);
	}
}

