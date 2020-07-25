import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { AlertService, AuthenticationService } from '../shared/services/index';

@Component({
    selector: 'app-reset-password',
    templateUrl: './reset-password.component.html',
    styleUrls: ['./reset-password.component.scss']
})

export class ResetPasswordComponent implements OnInit {
    public resetPasswordForm: FormGroup;
    public loading = false;
    public submitted: boolean;
    public events: any[] = [];
    public returnUrl = '/login';
    public _id: string;
    public _uid: number;
    public email: string;
    public isEmail = false;
    constructor(
        private _fb: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private authenticationService: AuthenticationService,
        private alertService: AlertService) { }

    ngOnInit() {


        this._id = this.route.snapshot.params['id'];
        this._uid = this.route.snapshot.params['uid'];

        this.fetchUser();
    }

    fetchUser() {
        this.authenticationService.getUser(this._uid, this._id)
            .subscribe(
                data => {
                    console.log(data);
                    this.email = data.email;
                    this.loading = false;
                    this.prepareForm();
                },
                error => {
                    const err = JSON.parse(error._body);
                    this.alertService.error(err.error.message);
                    this.loading = false;
                });
    }

    prepareForm() {
        this.resetPasswordForm = this._fb.group({
             password: [null, Validators.compose([Validators.required, Validators.minLength(4)])],
             confirmPassword: [null, Validators.compose([Validators.required, Validators.minLength(4)])],
        });

        // subscribe to form changes
        this.subcribeToFormChanges();

        this.isEmail = true;
    }

    subcribeToFormChanges() {
        const myFormStatusChanges$ = this.resetPasswordForm.statusChanges;
        const myFormValueChanges$ = this.resetPasswordForm.valueChanges;
        myFormStatusChanges$.subscribe(x => this.events.push({ event: 'STATUS_CHANGED', object: x }));
        myFormValueChanges$.subscribe(x => this.events.push({ event: 'VALUE_CHANGED', object: x }));
    }

    onResetPassword(resetPasswordForm, isValid: boolean) {
        this.submitted = true;
        // localStorage.setItem('isLoggedin', 'true');
        if (isValid) {
            this.doResetPassword(resetPasswordForm);
        }
    }

    doResetPassword (resetPasswordForm) {
        this.loading = true;
        this.authenticationService.resetPassword(resetPasswordForm.password, this.email, this._id)
            .subscribe(
                data => {
                    this.alertService.success('Your password has been successfully updated.', true);
                    this.router.navigate([this.returnUrl]);
                },
                error => {
                    const err = JSON.parse(error._body);
                    this.alertService.error(err.error.message);
                    this.loading = false;
                });
    }
}
