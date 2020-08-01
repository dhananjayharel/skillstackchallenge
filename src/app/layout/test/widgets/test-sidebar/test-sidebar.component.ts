import { Component, Input, Output, OnInit, EventEmitter, ViewChild } from '@angular/core';
import { OnlineTest } from 'models';
import {SharedtestactionsService } from '../../sharedtestactions.service';
import { Router }              from '@angular/router';
import {
    NgbModal,
    ModalDismissReasons
  } from '@ng-bootstrap/ng-bootstrap';
@Component({
  selector: 'app-test-sidebar',
  templateUrl: './test-sidebar.component.html',
  styleUrls: ['./test-sidebar.component.scss']
})
export class TestSidebarComponent implements OnInit {
  @Input() public tests: OnlineTest[];
  @Output() onTestSelect: EventEmitter<string> = new EventEmitter();
  @ViewChild('previewSnapshot') previewSnapshot: any;
  private selectedItem = 0;
    public tempImgUrl = '';
  private modalReference: any;
  private closeResult: string;
  constructor(private _sharedService: SharedtestactionsService,
    private router: Router,
    private modalService: NgbModal) { }

  ngOnInit() {
  }

  returnSanitizedDescription(index){
	  if(this.tests[index].problemDefination){
      const sanitizedStr = this.tests[index].problemDefination.replace(/<(?:.|\n)*?>/gm, '')
      if (sanitizedStr.length > 60) {
          return sanitizedStr.replace(/\r?\n|\r/g, '').replace(/^(.{60}[^\s]*).*/, "$1").replace(/&nbsp;/gi," ") + '...'; 
      } else {
          return sanitizedStr;
      }
  }
  else return "";
  }

  openImagePopup(image) {
    this.tempImgUrl = image;
    this.openModal(this.previewSnapshot, {size: 'lg' });
  }

  openModal(content, _options) {
        this.modalReference = this.modalService.open(content, _options);
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
            return `with: ${reason}`;
        }
    }

  onTestClick(index) {
    //this.selectedItem = index;
   // this._sharedService.showActiveTest(this.tests[index]);
    //this._sharedService.setSidebarVisibility(false);
    this.router.navigate(['/challenge/view/'+index]);
  }

  resetFilter() {
    const _filter = {
        where: {
            category: '',
            name: ''
        },
        order: 'created ASC'
    }
    this._sharedService.setTestFilter(_filter);
}

}
