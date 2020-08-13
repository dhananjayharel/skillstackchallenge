import {
  Component,
  OnInit,
  ViewChild
} from '@angular/core';
import {
  Router
} from '@angular/router';
import {
  QuestionData
} from '../data/formData.model';
import {
  FormDataService
} from '../data/formData.service';
import {
  NgbModal,
  ModalDismissReasons
} from '@ng-bootstrap/ng-bootstrap';
import {
  HostListener
} from '@angular/core';
import {
  Observable
} from 'rxjs/Observable';
import {
  TinymceModule
} from 'ng2-tinymce-alt';
import { OnlineTestService, AlertService } from './../../../../../shared';
import {
  FileUploader
} from 'ng2-file-upload';

@Component({
  selector: 'mt-wizard-question',
  templateUrl: './testcasetab.component.html',
  styles: [`.question-wrapper iframe { height: 300px !important; }`]
})

export class TestcaseTabComponent implements OnInit {
  title = '';
  	public levels = [1,2,3,4,5];
  questionData: QuestionData;
  form: any;
  private submitted = false;
  public editor: any;
  private loading: boolean;
  private isDirty: boolean;
  public uploader: FileUploader;
  private modalReference: any;
  private closeResult: string;
  public tempFileUploadUrl: string = null;
  @ViewChild('questionDataForm') templateForm: any;

  constructor(private router: Router,
        private formDataService: FormDataService,
        private modalService: NgbModal,
        private _onlineTestService: OnlineTestService,
        private alertService: AlertService) {
    this.loading = true;
  }

  ngOnInit() {
    // this.uploader = new FileUploader({url: URL});


    if (this.formDataService.getMode() === 'EDIT') {
      this.formDataService.editTest$.subscribe(
        data => {
          this.questionData = this.formDataService.getQuestionData();
		  console.log("questionData"+this.questionData);
   
          this.loading = false;
        }
      );
      this.formDataService.fetchOnlineTest();
    } else {
      this.questionData = this.formDataService.getQuestionData();
	    console.log("questionDatbbbbbbbbbbba"+this.questionData);
      this.loading = false;
    }

    // this.templateForm.valueChanges.subscribe((value: any) => {
    //   if (this.templateForm.dirty) {
    //     console.log('template form dirty - yes: ', value);
    //   } else {
    //     console.log('template form dirty - no: ');
    //   }
    // });
  }

  save(form: any): boolean {
    if (!form.valid) {
      return false;
    }


    this.formDataService.setQuestionData(this.questionData);
    return true;
  }

  goToPrevious(form: any) {
    if (this.save(form)) {
      // Navigate to the basic page
      if (this.formDataService.getMode() === 'EDIT') {
        this.router.navigate(['/challenge/edit/' + this.formDataService.getOnlineTestId() + '/basic']);
      } else {
        this.router.navigate(['/challenge/add/basic']);
      }
    }
  }

 goToNext(form: any) {
        if (this.save(form)) {
            this.submitted = true;
            if (this.formDataService.getMode() === 'EDIT') {
                this.formDataService.updateNewRecord();
            } else {
                 // Navigate to the question page
				 this.formDataService.createNewRecord();
            }
        } else {
            let elem = document.querySelector('.error');
            // .focus();
        }
    }
	
		addMoreTestcases(){
		this.questionData.testcases.push({"input":"","output":"","error":"","priority":1})
	}
	removeLastTestcase(){
		this.questionData.testcases.pop();
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

  @HostListener('window:beforeunload')
  canDeactivate(): Observable < boolean > | boolean {
    // insert logic to check if there are pending changes here;
    // returning true will navigate without confirmation
    // returning false will show a confirm dialog before navigating away
    console.log(this.templateForm);
    return !this.templateForm.dirty || this.submitted;
  }
}