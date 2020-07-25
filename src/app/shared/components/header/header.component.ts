import { Component, OnInit } from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
// import { UserService } from '../../../shared/';
import { Router } from '@angular/router';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
    public fullname: string;

    constructor(private translate: TranslateService,
				private router: Router,
                // private userService: UserService
                ) { this.fullname = 'Profile'; }

    ngOnInit() {

        const currentUser = JSON.parse(localStorage.getItem('currentUser'));

        // if (currentUser && currentUser.userId) {

        //     this.userService.getById(currentUser.userId)
        //     .subscribe(
        //         data => {
        //             this.fullname = data.fullname;
        //             console.log(data);
        //         },
        //         error => {
        //             const err = JSON.parse(error._body);
        //         });
        // }
    }

    toggleSidebar() {
        const dom: any = document.querySelector('body');
        dom.classList.toggle('push-right');
    }
	hideSidebar(){
	const dom: any = document.querySelector('body');
	dom.classList.remove('push-right');
	}

    rltAndLtr() {
        const dom: any = document.querySelector('body');
        dom.classList.toggle('rtl');
    }

    onLoggedout() {
        localStorage.removeItem('isLoggedin');
    }

    changeLang(language: string) {
        this.translate.use(language);
    }
	
  addTest(){	    
		this.router.navigate(['/test/add']);
   }
}
