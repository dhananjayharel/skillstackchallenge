import { Component, OnInit } from '@angular/core';
import {SharedenvironmentactionsService } from '../../sharedenvironmentactions.service';

@Component({
  selector: 'app-env-filter',
  templateUrl: './environment-filter.component.html',
  styleUrls: ['./environment-filter.component.scss']
})
export class EnvironmentFilterComponent implements OnInit {
	public filter = {
		where: {
			category: null,
		},
		order: {
			name: null,
			created: null
		}
	}
	public categoryData = [
		{name: 'php', value: 'PHP'},
		{name: 'java', value: 'Java'}
	];

	public dateOrderData = [
		{name: 'Date Asc', value: 'created ASC'},
		{name: 'Date Desc', value: 'created DESC'}
	];

	public nameOrderData = [
		{name: 'Name Asc', value: 'name ASC'},
		{name: 'Name Desc', value: 'name DESC'}
	];

	constructor(private _sharedService:SharedenvironmentactionsService) { }

	ngOnInit() {
	}

	updateFilterData($event) {
		for(let key in $event){

			if(key === 'name') {
				this.filter.order.name = $event.name;
			} else if(key === 'created') {
				this.filter.order.created = $event.created;
			} else if(key === 'category') {
				this.filter.where.category = $event.category;
			}
		}
		

		this._sharedService.setEnvironmentFilter(this.filter);
	}

}
