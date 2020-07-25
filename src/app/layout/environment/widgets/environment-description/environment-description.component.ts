import { Component, Input, OnInit, OnChanges, ViewChild } from '@angular/core';
import { Environment } from 'models';
import {SharedenvironmentactionsService } from '../../sharedenvironmentactions.service';
import { EnvironmentService, AlertService } from './../../../../shared';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-env-description',
  templateUrl: './environment-description.component.html',
  styleUrls: ['./environment-description.component.scss']
})
export class EnvironmentDescriptionComponent implements OnInit, OnChanges {
  @Input() public environment: Environment;
  private closeResult: string;
  private animationClass = 'fadeIn';
  @ViewChild('cloneTestModal') cloneModal: any;
  @ViewChild('launchMachineModal') launchMachineModal: any;

  constructor(private _sharedService: SharedenvironmentactionsService,
    private alertService: AlertService,
    private modalService: NgbModal,
    private environmentService: EnvironmentService) {
    this._sharedService.activeEnvironment$.subscribe(
      data => {
          this.environment = data;
          this.triggerAnimation();
      });
   }

  ngOnInit() {
  }

  ngOnChanges() {
    console.log(this.environment);
  }

  triggerAnimation() {
    this.animationClass = '';
    const that = this;
    setTimeout(function () {
      that.animationClass = 'fadeIn';
    }, 10);
  }


  openPreviewMachineModal() {
    this.openModal(this.launchMachineModal);
  }

  openCloneTestModal() {
    this.openModal(this.cloneModal);
  }

  openModal(content) {
      this.modalService.open(content, {size: 'lg'}).result.then((result) => {
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

  onDelete(testId:number){
      
      var r = confirm("Are you sure you want to delete?");
      if (r == true) {
          this.environmentService.delete(testId)
          .subscribe(
            data => {
               
                this.alertService.success("The environment was deleted successfully.");
                this._sharedService.refresh();
                
            },
            error => {
                var err = JSON.parse(error._body);
                this.alertService.error(err.error.message);
            });
      } 
  }

}
