import { Component, OnInit } from '@angular/core';
import { AlertService } from '../../services/alert.service';
@Component({
    selector: 'app-alert',
    templateUrl: './alert.component.html',
    styleUrls: ['./alert.component.scss']
})
export class AlertComponent implements OnInit {
    message: any;
    HIDECSSCLASS = 'bounceOutRight';
    SHOWCSSCLASS = 'bounceInRight';
    showHideCssClass = this.SHOWCSSCLASS;

    constructor(private alertService: AlertService) { }

   ngOnInit() {
      this.alertService.getMessage().subscribe(message => {
                                                this.message = message;
                                                this.showHideCssClass = this.SHOWCSSCLASS;
                                             });
   }

   closeAlert() {
        this.showHideCssClass = this.HIDECSSCLASS;
        setTimeout(() => this.reset(), 2000);
   }

   reset() {
     this.message = '';
   }
}
