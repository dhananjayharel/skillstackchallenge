import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import {NgbTimeStruct} from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { Environment } from '../../../../../models/environment.interface';
import { AlertService, EnvironmentService,AwsService } from './../../../../shared';
import { CATEGORY } from  '../../../../../models/';
import { HostListener } from '@angular/core';
import { Observable } from 'rxjs/Observable';

@Component({
    selector: 'app-onlinetest-add',
    templateUrl: './add.component.html',
    styleUrls: ['./add.component.scss']
})

export class AddComponent implements OnInit {
    private _id: number;
    private editModel: Environment;
    public environmentForm: FormGroup;
    public submitted: boolean;
    public events: any[] = [];
    public loading: boolean;
    public returnUrl: string;
    public amis: any[] = [];
    public categories = CATEGORY;
    public page_title = 'Add Environment';
    defaultTime = {hour: 1, minute: 0};

    constructor(private _fb: FormBuilder,
                 private route: ActivatedRoute,
                private router: Router,
                private environmentService: EnvironmentService,
                private awsService: AwsService,
                private alertService: AlertService) { 
                    this.loading = true;
                }

    ngOnInit() {
        console.log(this.categories);
        this._id = this.route.snapshot.params['id'];
        this.returnUrl = '/environment'; 
        if(this._id) {
            this.page_title ='Edit Environment:';
            this.environmentService.getById(this._id)
            .subscribe(
                data => {
                    console.log(data);
                    this.page_title += ' ' + data.name;
                    this.editModel = data;
                    this.loading = false;
                    this.prepareEditForm();
                },
                error => {
                    const err = JSON.parse(error._body);
                    this.alertService.error(err.error.message);
                    this.loading = false;
                });
        } else {
            this.loading = false;
            this.prepareAddForm();
        }
        
    }

    prepareEditForm () {
        this.environmentForm = this._fb.group({
            name: [this.editModel.name, [<any>Validators.required, <any>Validators.minLength(5)]],
            description: [this.editModel.description],
            tags: [this.editModel.tags],
            category: [this.editModel.category],
            evalcode: [this.editModel.evalcode],
            git_url: [this.editModel.git_url],
        });

        console.log(this.environmentForm);

        this.subcribeToFormChanges();

    }

    prepareAddForm () {
        this.environmentForm = this._fb.group({
            name: ['', [<any>Validators.required, <any>Validators.minLength(5)]],
            description: [''],
            tags: [''],
            category: [''],
            base_imageid: ['', [<any>Validators.required, <any>Validators.pattern(/^(?:(?!null).)*$/)]],
            base_technology_details: [''],
            instanceid: ['', [<any>Validators.required, <any>Validators.minLength(0)]],
            published: [],
            git_url: [],
			evalcode: []
        });

        // subscribe to form changes
        this.subcribeToFormChanges();
        (<FormControl>this.environmentForm.controls['published'])
           .setValue(true, { onlySelf: true });
        (<FormControl>this.environmentForm.controls['instanceid'])
           .setValue('', { onlySelf: true });

            
            const currentUser = this.getCurrentUserId().userId;
            this.environmentService.getAllEnvs(currentUser)
            .subscribe(
                data => {
                    this.amis = data;

                },
                error => {
                    const err = JSON.parse(error._body);
                    this.alertService.error(err.error.message);
                    this.loading = false;
                });

    }

    getCurrentUserId(){
        return JSON.parse(localStorage.getItem('currentUser'));
    }

    subcribeToFormChanges() {
        const myFormStatusChanges$ = this.environmentForm.statusChanges;
        const myFormValueChanges$ = this.environmentForm.valueChanges;
        myFormStatusChanges$.subscribe(x => this.events.push({ event: 'STATUS_CHANGED', object: x }));
        myFormValueChanges$.subscribe(x => this.events.push({ event: 'VALUE_CHANGED', object: x }));
    }

    save(model: Environment, isValid: boolean) {
        this.submitted = true;
        if(this.editModel) {

            this.editModel.name = model.name;
            this.editModel.description = model.description;
            this.editModel.tags = model.tags;
            this.editModel.category = model.category;
            this.editModel.evalcode = model.evalcode;
            this.editModel.git_url = model.git_url;
            this.updateEnvironment();
    

        } else {
            if (model.base_imageid === '') {
                this.alertService.error('Please select a Base Technology to base your environment on'); 
                return;
             }
     
             const currentUser = this.getCurrentUserId();
             if (currentUser) {
                 model['uid'] = currentUser.userId;
             }
             this.saveEnvironment(model);
        }
        

        
    }

    saveEnvironment(model){
        this.loading = true;
        console.log(model);
         this.environmentService.create(model)
             .subscribe(
                 data => {
                     this.router.navigate([this.returnUrl]);
                     this.alertService.success('The Environment has been saved.', true);

                 },
                 error => {
                     const err = JSON.parse(error._body);
                     this.alertService.error(err.error.message);
                     this.loading = false;
                 });
    }

    updateEnvironment() {
        console.log(this.editModel);
        this.environmentService.update(this.editModel)
            .subscribe(
                data => {
                    this.router.navigate([this.returnUrl]);
                    this.alertService.success('The Environment has been updated.', true);

                },
                error => {
                    const err = JSON.parse(error._body);
                    this.alertService.error(err.error.message);
                    this.loading = false;
                });
    }

    @HostListener('window:beforeunload')
    canDeactivate(): Observable<boolean> | boolean {
        // insert logic to check if there are pending changes here;
        // returning true will navigate without confirmation
        // returning false will show a confirm dialog before navigating away

        return this.events.length === 0 || this.submitted;
    }
}
