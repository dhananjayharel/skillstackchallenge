import { Component, Input, Output, OnInit, EventEmitter, ViewChild } from '@angular/core';
import { OnlineTest } from 'models';
import {SharedtestactionsService } from '../../sharedtestactions.service';
import {
    OnlineTestService,
    AlertService,
} from './../../../../shared';
import { Router }              from '@angular/router';
import {Inject} from "@angular/core";
import {DOCUMENT} from "@angular/platform-browser";
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
	     private dom: Document;
		 private currentTestId = 0;
	 private copymessage = "Copy to clipboard";
  @Input() public tests: OnlineTest[];
  @Output() onTestSelect: EventEmitter<string> = new EventEmitter();
  @ViewChild('previewSnapshot') previewSnapshot: any;
      @ViewChild('launchMachineModal') launchMachineModal: any;
    @ViewChild('previewonMobile') previewonMobile: any;
	@ViewChild('launchEmbedChallengeModal') launchEmbedChallengeModal: any;
  private selectedItem = 0;
    public tempImgUrl = '';
  private modalReference: any;
  private closeResult: string;
  constructor(private _sharedService: SharedtestactionsService,
    private router: Router,
	        private alertService: AlertService,
        private modalService: NgbModal,
        private onlineTestService: OnlineTestService,
		@Inject(DOCUMENT) dom: Document
	) {
	this.dom=dom;
	}

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

    previewTest(testid,category) {
      let msg = 'Launch a preview for this Challenge?\nThis will launch the widget in new tab.';
     
        const r = confirm(msg);
        if (r === true) {
            const currentUser = JSON.parse(localStorage.getItem('currentUser'));
			let protocol = "https";
			if(category=="reactjs"||category=="angular")
				protocol="http";
            window.open(protocol+"://www.skillstack.com/embedchallenges2/?courseid=java21ssh&examplepath=echotest&challenge=" + testid + "&category="+category+"&loggedin=false", '_blank');

        }
    }

    previewOnMobile() {
        this.openModal(this.previewonMobile, {});
    }
	
	EmbedChallenge(testId){
		 this.copymessage = "copy on clipboard";
		 this.currentTestId = testId;
		 this.openModal(this.launchEmbedChallengeModal, {});
	}
	
	  copyElementText(id) {
		 
        var element = null; // Should be <textarea> or <input>
        try {
            element = this.dom.getElementById(id);
            element.select();
            this.dom.execCommand("copy");
        }
        finally {
           this.dom.getSelection().removeAllRanges;
		   this.copymessage = "copied!!!";
        }
    }
	




    onDelete(testId: number,index:number) {

        const r = confirm('Are you sure you want to delete this test:' + testId + '?');
        if (r === true) {
            this.onlineTestService.delete(testId)
                .subscribe(
                    data => {
                        this.router.navigate(['/challenge']);
                        this.alertService.success('The test ' + testId + ' was deleted successfully.');
						this.tests.splice(index,1); 
                        this._sharedService.refresh();

                    },
                    error => {
                        const err = JSON.parse(error._body);
                        this.alertService.error(err.error.message);
                    });
        }
    }

}
