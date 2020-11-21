import { Component, OnInit } from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
// import { UserService } from '../../../shared/';
import { Router } from '@angular/router';
import { NgbModal, ModalDismissReasons, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
 
@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
    public fullname: string;
      private closeResult: string;
  private modalReference: any;
    constructor(private translate: TranslateService,
				private router: Router,
                // private userService: UserService
				private modalService: NgbModal
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
		this.router.navigate(['/challenge/add']); 
   }
   
     openModal(content) {
    const options: NgbModalOptions = {
      size: 'sm'
    };
    this.modalReference = this.modalService.open(content, options);
    this.modalReference.result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return  `with: ${reason}`;
    }
  }

  public goTo(mode) {
    if (mode === 'CREATE_NEW') {
      this.router.navigate(['/challenge/add']);
    } else {
      this.router.navigate(['/challenge/clone']);
    }
    this.modalReference.close();
  }
   
}
