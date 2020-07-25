import { Component, OnInit, ViewChild }   from '@angular/core';
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

export class BasicTabComponent implements OnInit {
    title = 'Add Basic Data';
    basicData: BasicData;
    public categoryData: any[];
    form: any;
    private _id: number;
    public loading: boolean;
    private submitted = false;
    @ViewChild('basicDataForm') templateForm: any;

    constructor(private router: Router,
        private formDataService: FormDataService,
        private _onlineTestService: OnlineTestService,
        private alertService: AlertService) {
            this.loading = true;
    }

    ngOnInit() {
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
                }
            );
            this.formDataService.fetchOnlineTest();
        } else {
            this.basicData = this.formDataService.getBasicData();
            this.loading = false;
        }
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
				 this.formDataService.createNewRecord();
            }
        } else {
            let elem = document.querySelector('.error');
            // .focus();
        }
    }

    onCancel() {
        this.router.navigate(['/test/view/'+this._id]);
    }
	
	addMoreTestcases(){
		this.basicData.testcases.push({"input":"","output":"","error":"","priority":""})
	}
	removeLastTestcase(){
		this.basicData.testcases.pop();
	}
	
	
	
   



    @HostListener('window:beforeunload')
    canDeactivate(): Observable<boolean> | boolean {
        // insert logic to check if there are pending changes here;
        // returning true will navigate without confirmation
        // returning false will show a confirm dialog before navigating away
        let isDirty = false;
        for (let field in this.templateForm.form.controls) {
            if (field !== 'environment' && this.templateForm.form.controls[field].dirty) {
                isDirty = true;
                break;
            }
        }
        return !isDirty || this.submitted;
    }
}
