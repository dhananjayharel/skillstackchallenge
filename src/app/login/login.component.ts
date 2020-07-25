import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { AlertService, AuthenticationService, UserService } from '../shared/services/index';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})

export class LoginComponent implements OnInit {
    public loginForm: FormGroup;
    public loading = false;
    public submitted: boolean;
    public events: any[] = [];
    public returnUrl: string;

    constructor(
        private _fb: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private authenticationService: AuthenticationService,
        private alertService: AlertService,
        private userService: UserService) { }

    ngOnInit() {

        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        if (currentUser && currentUser.id) {
            // reset login status
            this.authenticationService.logout();

        }

        this.loginForm = this._fb.group({
            email: [null, Validators.compose([Validators.required, Validators.minLength(1)])],
            password: [null, Validators.compose([Validators.required, Validators.minLength(4)])],
        });

        // subscribe to form changes
        this.subcribeToFormChanges();

        // get return url from route parameters or default to '/'
        this.returnUrl = '/test';
    }

    subcribeToFormChanges() {
        const myFormStatusChanges$ = this.loginForm.statusChanges;
        const myFormValueChanges$ = this.loginForm.valueChanges;
        myFormStatusChanges$.subscribe(x => this.events.push({ event: 'STATUS_CHANGED', object: x }));
        myFormValueChanges$.subscribe(x => this.events.push({ event: 'VALUE_CHANGED', object: x }));
    }

    onLoggedin(loginForm, isValid: boolean) {
        this.submitted = true;
        // localStorage.setItem('isLoggedin', 'true');

        if (isValid) {
            this.doLogin(loginForm);
        }
    }

    doLogin(loginForm) {
        this.loading = true;
        this.authenticationService.login(loginForm.email, loginForm.password)
            .subscribe(
                data => {
                  this.pullUser(data['userId']);
                },
                error => {
                    const err = JSON.parse(error._body);
                    this.alertService.error(err.error.message);
                    this.loading = false;
                });
    }

    pullUser (userId) {
      this.userService.getById(userId)
      .subscribe(
          data => {
              localStorage.setItem('currentUserData', JSON.stringify(data));
              this.router.navigate([this.returnUrl]);
          },
          error => {
              const err = JSON.parse(error._body);
              this.loading = false;
          });
    }
}
