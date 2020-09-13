import { Injectable }                        from '@angular/core';
import { OnlineTestService, AlertService } from './../../../../../shared';
import { FormData, BasicData, QuestionData }       from './formData.model';
import { WorkflowService }                   from '../workflow/workflow.service';
import { STEPS }                             from '../workflow/workflow.model';
import { OnlineTest } from '../../../../../../models/onlinetests.interface';
import { Router }              from '@angular/router';


import { Subject } from 'rxjs/Subject';

@Injectable()
export class FormDataService {
    private _id: number;
    private editTestObj: OnlineTest;
    private editTest = new Subject<OnlineTest> ();
    editTest$ = this.editTest.asObservable();
    private isSubmitted = new Subject<boolean> ();
	private testName = new Subject<string> ();
	testName$ = this.testName.asObservable();
    isSubmitted$ = this.isSubmitted.asObservable();
    private formData: FormData = new FormData();
    private isPersonalFormValid: boolean = false;
    private isWorkFormValid: boolean = false;
    private isAddressFormValid: boolean = false;

    constructor(private router: Router,
        private workflowService: WorkflowService,
        private _onlineTestService: OnlineTestService,
        private alertService: AlertService) { 
            console.log('formdata service call');
    }

    getMode(): string {
        return this.workflowService.getMode();
    }

    getEditId(): number {
        return this.workflowService.getEditId();
    }

    getEditTestObj(): OnlineTest {
        return this.editTestObj;
    }
	    getEditTestName(): string {
        return this.editTestObj.name;
    }

    getBasicData(): BasicData {
        // Return the BasicData data
        const basicData: BasicData = {
            name: this.formData.name ? this.formData.name : '',
            testLevel: this.formData.testLevel ? this.formData.testLevel : 'middle',
            category: this.formData.category ? this.formData.category : '',
			problemDefination:this.formData.problemDefination ? this.formData.problemDefination : 'middle',
			//testcases: this.formData.testcases ? this.formData.testcases : [{"input":"1","output":"1","error":"1","priority":1},{"input":"22","output":"22","error":"22","priority":1}],
            GitHubUrl:this.formData.GitHubUrl ? this.formData.GitHubUrl : ''
        };
        return basicData;
    }

    setBasicData(data: BasicData) {
        // Update the Personal data only when the Personal Form had been validated successfully
        this.isPersonalFormValid = true;
        this.formData.name = data.name;
        this.formData.testLevel = data.testLevel;
        this.formData.category = data.category;
		this.formData.problemDefination = data.problemDefination;
		//this.formData.testcases = data.testcases;
     this.formData.GitHubUrl = data.GitHubUrl;
		// this.formData.GitHubUrl = data.GitHubUrl;
        // Validate Personal Step in Workflow
        this.workflowService.validateStep(STEPS.basic);
    }

    getQuestionData(): QuestionData {
        // Return the work type
        const question: QuestionData={
         testcases: this.formData.testcases ? this.formData.testcases : [{"input":"","output":"","error":"","priority":1},{"input":"","output":"","error":"","priority":1}]
		}
        return question;
    }

    setQuestionData(data: QuestionData) {
        // Update the work type only when the Work Form had been validated successfully
        this.isWorkFormValid = true;
        this.formData.testcases = data.testcases;
        // Validate Work Step in Workflow
        this.workflowService.validateStep(STEPS.testcase);
    }
	
	








    getMcqData () {
        console.log(this.formData)
       
    }
    setMcqData (data) {

    }

    getFormData(): FormData {
        // Return the entire Form Data
        return this.formData;
    }

    setFormData(onlineTest) {
        if(onlineTest) {
            const _basicData = new BasicData();
            _basicData.name = onlineTest.name;
            _basicData.testLevel  = onlineTest.testLevel;
            _basicData.category  = onlineTest.category;
			_basicData.problemDefination = onlineTest.problemDefination;
          //  _basicData.testcases = onlineTest.testcases;
             _basicData.GitHubUrl =  onlineTest.GitHubUrl
            this.setBasicData(_basicData);

          
            const _questionData = new QuestionData();
            _questionData.testcases = onlineTest.testcases;

            this.setQuestionData(_questionData);
			this.testName.next(onlineTest.name);
  
        }
    }

    resetFormData(): FormData {
        // Reset the workflow
        this.workflowService.resetSteps();
        // Return the form data after all this.* members had been reset
        this.formData.clear();
        this.isPersonalFormValid = this.isWorkFormValid = this.isAddressFormValid = false;
        return this.formData;
    }

    isFormValid() {
        // Return true if all forms had been validated successfully; otherwise, return false
        return this.isPersonalFormValid &&
                this.isWorkFormValid && 
                this.isAddressFormValid;
    }

    fetchOnlineTest() {
        this._onlineTestService.getById(this.workflowService.getEditId())
        .subscribe(
            data => {
                console.log(data);
                this.setFormData(data);
                this.editTestObj = data;
                this.editTest.next(data);
            },
            error => {
                const err = JSON.parse(error._body);
                this.alertService.error(err.error.message);
            }
        );
    }

    getOnlineTestId () {
        return this.editTestObj.id;
    }

    prepareModelObj (_test) {
        const _basicData = this.getBasicData();
        _test.name = _basicData.name;
        _test.testLevel  = _basicData.testLevel;
        _test.category  = _basicData.category;
		_test.problemDefination = _basicData.problemDefination;
	   // _test.testcases = _basicData.testcases;
		_test.GitHubUrl = _basicData.GitHubUrl;
     
	    const _questionData = this.getQuestionData();
        _test.testcases = _questionData.testcases;
     



        return _test;
    }

    createNewRecord () {

        this.editTestObj = <OnlineTest> {published: true};
        const inputObj = this.prepareModelObj(this.editTestObj);

        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        if (currentUser) {
            inputObj['uid'] = currentUser.userId;
        }

        this._onlineTestService.create(inputObj)
        .subscribe(
            data => {
                console.log(data);
                this.router.navigate(['/challenge']);
                this.alertService.success('The challenge' + data.name + ' is added successfully.');
                // this.isSubmitted.next(true);
            },
            error => {
                const err = JSON.parse(error._body);
                this.alertService.error(err.error.message);
                this.isSubmitted.next(false);
            }
        );
    }

    updateNewRecord () {
        const inputObj = this.prepareModelObj(this.editTestObj);
        this._onlineTestService.update(inputObj)
        .subscribe(
            data => {
                this.router.navigate(['/challenge']);
                this.alertService.success('The challenge ' + data.name + ' is updated successfully.');
                // this.isSubmitted.next(true);
            },
            error => {
                const err = JSON.parse(error._body);
                this.alertService.error(err.error.message);
                this.isSubmitted.next(false);
            }
        );
    }
}