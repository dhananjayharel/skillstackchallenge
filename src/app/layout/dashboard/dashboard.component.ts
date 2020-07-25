import { Component, OnInit } from '@angular/core';
import { UserService } from '../../shared/';

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
    
    public loading: boolean;

    constructor(private userService: UserService) {
        
    }
    ngOnInit() {
        let currentUser = JSON.parse(localStorage.getItem('currentUser'));

        if(!localStorage.currentUserData && currentUser && currentUser.userId){
            console.log(currentUser.userId);
            this.loading = true;

            this.userService.getById(currentUser.userId)
            .subscribe(
                data => {
                    localStorage.setItem('currentUserData', JSON.stringify(data));
                    this.loading = false;
                },
                error => {
                    var err = JSON.parse(error._body);
                    this.loading = false;
                });
        }
    }

}
