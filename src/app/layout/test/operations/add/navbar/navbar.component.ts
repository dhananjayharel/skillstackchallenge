import { Component, OnInit} from '@angular/core';
import { FormDataService }     from '../data/formData.service';
@Component ({
    selector: 'msw-navbar'
    ,templateUrl: './navbar.component.html',
    styleUrls: ['./navbar.component.scss']
})

export class NavbarComponent implements OnInit {
    public _editMode: boolean;
    public _editId: number;
	public _testName: string;

    constructor( private formDataService: FormDataService) {
        if(this.formDataService.getMode() === 'EDIT') {
            this._editMode = true;
            this._editId = this.formDataService.getEditId();
        } else {
            this._editMode = false;
        }
    }
	
	ngOnInit(){
		 this.formDataService.testName$.subscribe(
      data => 
      {
        console.log('next subscribed value: ' + data);
        this._testName = data;
      }
    );
	}
}
