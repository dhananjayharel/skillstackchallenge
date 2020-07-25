import { Component, OnInit } from '@angular/core';
import { AlertService, OnlineTestService, ScriptService } from '../../shared';
import { routerTransition } from '../../shared/animations/fadeInOut.animation';
import { OnlineTest } from '../../../models/onlinetests.interface';
import {SharedtestactionsService } from './sharedtestactions.service';
import { Router, ActivatedRoute } from '@angular/router';
@Component({
    selector: 'app-test-page',
    templateUrl: './test-page.component.html',
    styleUrls: ['./test-page.component.scss'],
    providers: [SharedtestactionsService],
    // animations: [routerTransition()]
})
export class TestPageComponent implements OnInit {
    public loading: boolean;
    public sidebarVisiblity = true;
    public testSummaryVisiblity:string = '';
    public tests: OnlineTest[];
    public searchQuery: string;
    public activeTab: string;
    private selectedIndex = 0;
    public filterData = {
        where: {name: null, category: null, 'uid': this.getCurrentUserId().userId},
        order: 'created DESC'
    };

    showJobs: String = 'all';
    constructor(private alertService: AlertService,
                private onlineTestService: OnlineTestService,
                private _sharedService:SharedtestactionsService,
                private script: ScriptService,
                private route: ActivatedRoute) {

        this.route.queryParams.subscribe(params => {
          this.activeTab = params['activeTab'];
        });

        this._sharedService.filterData$.subscribe(
          data => {
              this._assignfilterData(data);
              this.searchOnlineTest();
          });

        this._sharedService.refreshOp$.subscribe(
            data => {
                console.log(data);
                if(data) {
                    this.searchOnlineTest();
                }
            });

        this._sharedService.showSidebar$.subscribe(
            data => {
                console.log(data);
                this._setSidebarVisibility(data);
            });

        this._sharedService.showCandidatePanel$.subscribe(
            data => {
                this._setSidebarVisibility(data);
            });
   }

    ngOnInit() {

        this.script.load('tinymce', 'tinymcetheme').then(data => {
            console.log('script loaded 22', data);
        }).catch(error => console.log(error));
        // const filter = { 'where':{'uid': this.getCurrentUserId().userId}};
        // this.fetchOnlineTests(filter);
        this.searchOnlineTest();

    }

    _setSidebarVisibility (op) {
        this.sidebarVisiblity = op;
        // if (op) {
        //     this.sidebarVisiblity = 'd-none';
        // } else {
        //     this.sidebarVisiblity = 'd-block';
        // }
    }

    _setTestSummaryVisibility(op) {
       // handle event when test summary visibility is toggled.
    }

    _assignfilterData (data: any) {

        // this.filterData.where['name'] =  data.where.name ?  data.where.name : this.filterData.where['name'];
        // this.filterData.where['category'] =  data.where.category;
        // this.filterData.order['created'] =  data.order.created;
        // this.filterData.order['name'] =  data.order.name;
        this.filterData = data;
        console.log(this.filterData);
    }

    getCurrentUserId() {
        return JSON.parse(localStorage.getItem('currentUser'));
    }

    searchByName ($event) {
        this.filterData.where['name'] =  $event.target.value;
        this. searchOnlineTest();
    }

    searchOnlineTest() {
        const filter = {};
        filter['where'] = {};
        if (this.filterData.where.name) {
            filter['where']['name'] = {'ilike': '' + this.filterData.where.name + ''};
        }
        if (this.filterData.where.category) {
            filter['where']['category'] = { 'ilike': this.filterData.where.category };
        }
        filter['where']['uid'] = this.getCurrentUserId().userId;



        // const orderArr = [];
        // if (this.filterData.order.created) {
        //     orderArr.push(this.filterData.order.created);
        // }

        // if (this.filterData.order.name) {
        //     orderArr.push(this.filterData.order.name);
        // }

        // if (orderArr.length > 1) {
        //     filter['order'] = orderArr;
        // } else if (orderArr.length > 0) {
        //     filter['order'] = orderArr[0];
        // }

        filter['order'] = this.filterData.order;

        this.fetchOnlineTests(filter);
    }

    setFilter(filter: String) {
        this.showJobs = filter;
    }

    fetchOnlineTests(filter = null) {

        this.loading = true;
        this.onlineTestService.getAll(filter)
        .subscribe(
            data => {
                this.tests = data;
                this.loading = false;
                console.log(data);
                if(this.route.snapshot.paramMap.has('testid')){ 
                    console.log("FOUND PARAM TESTID="+this.route.snapshot.params['testid']);
                    let testid = Number(this.route.snapshot.params['testid']);
                    let index = this.tests.map(obj => obj.id).indexOf(testid);
                   console.log("INDEX=="+index);
                    this.selectedIndex = index;
                    this._sharedService.showActiveTest(this.tests[1]);
                    this._sharedService.setSidebarVisibility(false);
                }
            },
            error => {
                const err = JSON.parse(error._body);
                this.alertService.error(err.error.message);
                this.loading = false;
            });
    }

    onDelete(testId: number) {
        const r = confirm('Are you sure you want to delete?');
        if (r === true) {
            this.onlineTestService.delete(testId)
            .subscribe(
                data => {
                    this.tests = data;
                    this.alertService.success('The online test was deleted successfully.');
                    const filter = { 'where': {'uid': this.getCurrentUserId().userId}};
                    this.fetchOnlineTests(filter);
                },
                error => {
                    const err = JSON.parse(error._body);
                    this.alertService.error(err.error.message);
                });
        }
    }
}
