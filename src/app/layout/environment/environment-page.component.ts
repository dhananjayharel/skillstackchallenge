import { Component, OnInit } from '@angular/core';
import { AlertService, EnvironmentService } from '../../shared';
import { Environment } from '../../../models/environment.interface';
import {SharedenvironmentactionsService } from './sharedenvironmentactions.service';

@Component({
    selector: 'app-environment-page',
    templateUrl: './environment-page.component.html',
    styleUrls: ['./environment-page.component.scss'],
    providers: [SharedenvironmentactionsService]
})
export class EnvironmentPageComponent implements OnInit {
    public loading: boolean;
    public environments: Environment[] = null;
    public searchQuery: string;
    public selectedIndex = 0;
    public filterData = {
        where: {name: null, category: null, 'uid': this.getCurrentUserId().userId},
        order: {name: null, created: null}
    };

    showJobs: String = 'all';
    constructor(private alertService: AlertService,
                private environmentService: EnvironmentService,
                private _sharedService:SharedenvironmentactionsService) {

        this._sharedService.filterData$.subscribe(
          data => {
              this._assignfilterData(data);
              this.searchEnvironment();
          });

        this._sharedService.refreshOp$.subscribe(
            data => {
                console.log(data);
                if(data) {
                    this.searchEnvironment();
                }
            });
   }

    ngOnInit() {

        const filter = { 'where':{'uid': this.getCurrentUserId().userId}};

        this.fetchEnvironments(filter);

    }

    _assignfilterData (data: any) {

        this.filterData.where['name'] =  data.where.name ?  data.where.name : this.filterData.where['name'];
        this.filterData.where['category'] =  data.where.category;
        this.filterData.order['created'] =  data.order.created;
        this.filterData.order['name'] =  data.order.name;
        console.log(this.filterData);
    }

    getCurrentUserId() {
        return JSON.parse(localStorage.getItem('currentUser'));
    }

    searchByName ($event) {
        this.filterData.where['name'] =  $event.target.value;
        this.searchEnvironment();
    }

    searchEnvironment() {


        const filter = {};
        filter['where'] = {};
        if(this.filterData.where.name) {
            filter['where']['name'] = this.filterData.where.name;
        }
        if(this.filterData.where.category) {
            filter['where']['category'] = this.filterData.where.category;
        }
        if(this.filterData.where.uid) {
            filter['where']['uid'] = this.filterData.where.uid;
        }


        let orderArr = [];
        if(this.filterData.order.created) {
            orderArr.push(this.filterData.order.created);
        }

        if(this.filterData.order.name) {
            orderArr.push(this.filterData.order.name);
        }

        if(orderArr.length > 1) {
            filter['order'] = orderArr;
        } else if (orderArr.length > 0) {
            filter['order'] = orderArr[0];
        }

        this.fetchEnvironments(filter);
    }

    setFilter(filter:String) {
        this.showJobs = filter;
    }

    fetchEnvironments(filter=null) {

        this.loading = true;
        this.environmentService.getAll(filter)
        .subscribe(
            data => {
                this.environments = data;
                this.loading = false;
                console.log(data);
            },
            error => {
                const err = JSON.parse(error._body);
                this.alertService.error(err.error.message);
                this.loading = false;
            });
    }

    onDelete(envId: number) {
        const r = confirm('Are you sure you want to delete?');
        if (r === true) {
            this.environmentService.delete(envId)
            .subscribe(
                data => {
                    this.environments = data;
                    this.alertService.success('The environment was deleted successfully.');
                    const filter = { 'where': {'uid': this.getCurrentUserId().userId}};
                    this.fetchEnvironments(filter);
                },
                error => {
                    const err = JSON.parse(error._body);
                    this.alertService.error(err.error.message);
                });
        }
    }
}
