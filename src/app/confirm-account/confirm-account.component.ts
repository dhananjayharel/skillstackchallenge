import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AlertService, AuthenticationService } from '../shared/services/index';

@Component({
    selector: 'app-confirm-account',
    templateUrl: './confirm-account.component.html',
    styleUrls: ['./confirm-account.component.scss']
})

export class ConfirmAccountComponent implements OnInit {
    public loading = false;
    public events: any[] = [];
    public returnUrl = '/login';
    public _id: string;
    public _uid: number;
    constructor(
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
        this.authenticationService.confirmAccount(this._uid, this._id)
            .subscribe(
                data => {
                    console.log(data);
                    this.loading = false;
                    this.router.navigate([this.returnUrl]);
                    this.alertService.success('Congrats! your email is successfuly verified. Please login to continue.');
                },
                error => {
                    const err = JSON.parse(error._body);
                    this.alertService.error(err.error.message);
                    this.loading = false;
                    this.router.navigate([this.returnUrl]);
                });
    }
}
