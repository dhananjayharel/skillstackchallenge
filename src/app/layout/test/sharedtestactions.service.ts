import { Injectable } from '@angular/core';
import { OnlineTest } from '../../../models/onlinetests.interface';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class SharedtestactionsService {
	private activeTest = new Subject<OnlineTest> ();
	private testList = new Subject<OnlineTest[]> ();
	private filterData =  new Subject<any> ();
	private refreshOp =  new Subject<boolean> ();
	private showSidebar =  new Subject<boolean> ();
	private showCandidatePanel =  new Subject<boolean> ();

	// Observable string streams
	activeTest$ = this.activeTest.asObservable();
	testList$ = this.testList.asObservable();
	filterData$ = this.filterData.asObservable();
	refreshOp$ = this.refreshOp.asObservable();
	showSidebar$ = this.showSidebar.asObservable();
	showCandidatePanel$ = this.showCandidatePanel.asObservable();

	constructor() { }

	showActiveTest(data: OnlineTest) {
		this.activeTest.next(data);
	}

	updateSideBar(data: OnlineTest[]) {
		this.testList.next(data);
	}

	setTestFilter(filter: any) {
		this.filterData.next(filter);
	}

	refresh() {
		this.refreshOp.next(true)
	}

	
	setSidebarVisibility( op: boolean){
		this.showSidebar.next(op);
	}

	setCandidatePanelVisibility( op: boolean){
		this.showSidebar.next(op);
	}
}

