import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { AlertService, AuthenticationService } from '../shared/services/index';

@Component({
    selector: 'app-forgot-password',
    templateUrl: './forgot-password.component.html',
    styleUrls: ['./forgot-password.component.scss']
})

export class ForgotPasswordComponent implements OnInit {
    public forgotPasswordForm: FormGroup;
    public loading = false;
    public submitted: boolean;
    public events: any[] = [];
    public returnUrl: string;

    constructor(
        private _fb: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private authenticationService: AuthenticationService,
        private alertService: AlertService) { }

    ngOnInit() {

        let currentUser = JSON.parse(localStorage.getItem('currentUser'));
        if (currentUser && currentUser.id) {
            // reset forgot-password status
            this.authenticationService.logout();

        }

        this.forgotPasswordForm = this._fb.group({
            email: [null, Validators.compose([Validators.required, Validators.minLength(1)])]  
        });

        // subscribe to form changes  
        this.subcribeToFormChanges();

        
    }

    subcribeToFormChanges() {
        const myFormStatusChanges$ = this.forgotPasswordForm.statusChanges;
        const myFormValueChanges$ = this.forgotPasswordForm.valueChanges;
        
        myFormStatusChanges$.subscribe(x => this.events.push({ event: 'STATUS_CHANGED', object: x }));
        myFormValueChanges$.subscribe(x => this.events.push({ event: 'VALUE_CHANGED', object: x }));
    }

    onForgotPassword(forgotPasswordForm, isValid: boolean) {
        this.submitted = true;
        //localStorage.setItem('isLoggedin', 'true');
        if(isValid)
            this.doForgotPassword(forgotPasswordForm);
    }

    doForgotPassword (forgotPasswordForm) {
        this.loading = true;
        this.authenticationService.requestForgotPassword(forgotPasswordForm.email)
            .subscribe(
                data => {
                    this.router.navigate(['/login']);
                    this.alertService.success('You will recieve an email to reset your password. Please check your inbox of your registered email address.');
                },
                error => {
                    var err = JSON.parse(error._body);
                    this.alertService.error(err.error.message);
                    this.loading = false;
                },
                ()=> this.loading = false);
    }
}
