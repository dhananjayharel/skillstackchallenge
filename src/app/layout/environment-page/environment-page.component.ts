import { Component, OnInit } from '@angular/core';
import { AlertService, EnvironmentService } from '../../shared';
import { Environment } from '../../../models/environments.interface';

@Component({
    selector: 'app-environment-page',
    templateUrl: './environment-page.component.html',
    styleUrls: ['./environment-page.component.scss']
})
export class EnvironementPageComponent implements OnInit {
    public loading: boolean;
	public envs :Environment[];
    public searchQuery: string;
	showEnvs:String = 'all';
    constructor(private alertService: AlertService,
    			private environmentService: EnvironmentService) { }
    ngOnInit() { 

        let filter = { 'where':{'uid': this.getCurrentUserId().userId}};
		this.fetchEnvironments(filter);
	}
	
    searchEnvironment(){


        let filter = { 'where':{'name': this.searchQuery, 'uid': this.getCurrentUserId().userId}};

        this.fetchEnvironments(filter);
    }

    getCurrentUserId(){
        return JSON.parse(localStorage.getItem('currentUser'));
    }

	fetchEnvironments(filter=null){

    	this.loading = true;
    	this.environmentService.getAll(filter)
    	.subscribe(
                data => {
                    //this.tests = data;
					for(var k in data) {
					//this.envs.push(k);
					}
					this.envs=data;
                    this.loading = false;
                    console.log(data);
                },
                error => {
                    var err = JSON.parse(error._body);
                    this.alertService.error(err.error.message);
                    this.loading = false;
                });
    }

    setFilter(filter:String){
    	this.showEnvs = filter;
    }

    onDelete(envId:number){
        
        var r = confirm("Are you sure you want to delete?");
        if (r == true) {
            this.environmentService.delete(envId)
            .subscribe(
                    data => {
                        this.envs = data;
                        this.alertService.success("The environment was deleted successfully.");
                        let filter = { 'where':{'uid': this.getCurrentUserId().userId}};

                        this.fetchEnvironments(filter);
                    },
                    error => {
                        var err = JSON.parse(error._body);
                        this.alertService.error(err.error.message);
                    });
        } 
    }
}
