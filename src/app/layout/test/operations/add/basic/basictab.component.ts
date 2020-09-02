import { Component, OnInit,AfterViewInit, ViewChild }   from '@angular/core';
import { Router }              from '@angular/router';
import { BasicData }            from '../data/formData.model';
import { FormDataService }     from '../data/formData.service';
import { OnlineTestService, AlertService } from './../../../../../shared';
import { CATEGORY } from  '../../../../../../models/';
import { HostListener } from '@angular/core';
import { Observable } from 'rxjs/Observable';


declare var require: any;

@Component ({
    selector:     'mt-wizard-basic'
    ,templateUrl: './basictab.component.html'
})

export class BasicTabComponent implements OnInit, AfterViewInit {
    title = 'Add Basic Data';
    basicData: BasicData;
    public categoryData: any[];
	public levels = [1,2,3,4,5];
    form: any;
    private _id: number;
    private problem = "1232133123";
	public loading: boolean;
    private submitted = false;
	private currentProblemDefVal="";
    @ViewChild('basicDataForm') templateForm: any;
    constructor(private router: Router,
        private formDataService: FormDataService,
        private _onlineTestService: OnlineTestService,
        private alertService: AlertService) {
            this.loading = true;
    }
	ngOnInit() { //alert('parent - ngAfterViewInit'); 
	}


    ngAfterViewInit() {

        const languageOptions = require('../../../../../shared/static/language.json');
        this.categoryData = languageOptions.map(item => {
            return {
                value: item.label,
                key: item.value
            };
        });
        if(this.formDataService.getMode() === 'EDIT') {
            this.formDataService.editTest$.subscribe(
                data => {
                    //console.log("&&&&&&&&&&&&&&&&&&&&&&&"+JSON.stringify(data));
                    this._id = data.id;
                    this.basicData = this.formDataService.getBasicData();
                    this.loading = false;
				    this.currentProblemDefVal = this.basicData.problemDefination;
                } 
            );
            this.formDataService.fetchOnlineTest();
        } else {
            this.basicData = this.formDataService.getBasicData();
			this.currentProblemDefVal = this.basicData.problemDefination;
            this.loading = false;
        }
    }
/*
    save(form: any): boolean {
        if (!form.valid) {
            return false;
        }
        console.log(this.basicData);
        this.formDataService.setBasicData(this.basicData);
        return true;
    }
	*/
/*
    goToNext(form: any) {
        if (this.save(form)) {
            this.submitted = true;
            if (this.formDataService.getMode() === 'EDIT') {
                this.formDataService.updateNewRecord();
            } else {
                 // Navigate to the question page
				 this.formDataService.createNewRecord();
            }
        } else {
            let elem = document.querySelector('.error');
            // .focus();
        }
    }
*/
    onCancel() {
        this.router.navigate(['/challenge']);
    }
	
	addMoreTestcases(){
		//this.basicData.testcases.push({"input":"","output":"","error":"","priority":1})
	}
	removeLastTestcase(){
		//this.basicData.testcases.pop();
	}
	
	
	    save(form: any): boolean {
        if (!form.valid) {
            return false;
        }
        console.log(this.basicData);
        this.formDataService.setBasicData(this.basicData);
        return true;
    }

    goToNext(form: any) {
        if (this.save(form)) {
            this.submitted = true;
            if (this.formDataService.getMode() === 'EDIT') {
                this.formDataService.updateNewRecord();
            } else {
                 // Navigate to the question page
                this.router.navigate(['/challenge/add/testcase']);
            }
        } else {
            let elem = document.querySelector('.error');
            // .focus();
        }
    }
   



    @HostListener('window:beforeunload')
    canDeactivate(): Observable<boolean> | boolean {
        // insert logic to check if there are pending changes here;
        // returning true will navigate without confirmation
        // returning false will show a confirm dialog before navigating away
        let isDirty = false;
        for (let field in this.templateForm.form.controls) {
			
            if (field !== 'problemDefination' && this.templateForm.form.controls[field].dirty) {
                isDirty = true;
                break;
            }
			if(this.currentProblemDefVal!=this.templateForm.form.controls["problemDefination"].value){
				  isDirty = true;
                break;
			}
        }
        return !isDirty || this.submitted;
    }
}
