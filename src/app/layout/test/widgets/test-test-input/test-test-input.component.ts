import { Component, OnInit, NgZone, forwardRef, Output, EventEmitter } from '@angular/core';
import { AlertService, OnlineTestService } from '../../../../shared';
import { OnlineTest } from '../../../../../models/onlinetests.interface';
import { NG_VALIDATORS, NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import { NgbModal, NgbModalOptions, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';

const UI_SWITCH_CONTROL_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => TestInputComponent),
  multi: true
};

const UI_FORM_VALIDATION: any = {
  provide: NG_VALIDATORS,
  useExisting: forwardRef(() => TestInputComponent),
  multi: true,
};

const noop = () => {
};

@Component({
  selector: 'app-test-input',
  templateUrl: './test-test-input.component.html',
  styleUrls: ['./test-test-input.component.scss'],
  providers: [UI_SWITCH_CONTROL_VALUE_ACCESSOR]
})
export class TestInputComponent implements OnInit, ControlValueAccessor    {
  public onlinetests: OnlineTest[];
  public filteredList: OnlineTest[];
  public loading = false;
  public foundCategory = [];
  public activeCategory: string;
  public queryString: string;
  private onTouchedCallback: () => void = noop;
  private onChangeCallback: (_: any) => void = noop;
  private _testId: number;
  private modalReference: any;
  private previewOnlineTest: OnlineTest;
  private closeResult: String;
  @Output() onTestSelect: EventEmitter<number> = new EventEmitter();

  constructor (private zone: NgZone,
  private alertService: AlertService,
  private _onlineTestService: OnlineTestService,
  private modalService: NgbModal ) {

  }

  ngOnInit() {
    this.fetchOnlineTestList();
  }



  // get accessor
  get value(): any {
    return this._testId;
  };

  // set accessor including call the onchange callback
  set value(v: any) {
    if (v !== this._testId) {
      this._testId = v;
      this.zone.run(() => {
        this.onChangeCallback(v);
      });
    }
  }
  // From ControlValueAccessor interface
  writeValue(value: any) {
    if (value != null && value !== this._testId) {
      this._testId = value;
      this.zone.run(() => {
        this.onChangeCallback(value);
      });
      this.onTestSelect.emit(this._testId);
    }
  }

  registerOnChange(fn: any) {
    this.onChangeCallback = fn;
  }

  registerOnTouched(fn: any) {
    this.onTouchedCallback = fn;
  }


  fetchOnlineTestList(filter = null) {
    this.loading = true;
    // this._onlineTestService.getAll({"where":{"or":[{"isGlobal":true},{"uid": this.getCurrentUserId().userId}]}})
    this._onlineTestService.getAll({'where':{'isLibraryTest': true}})
    .subscribe(
      data => {
        this.onlinetests = data;
        this.loading = false;
        let category = {};
        this.onlinetests.forEach(test => {
          if (!category[test['category']]) {
            category[test['category']] = 0;
          }
          category[test['category']] ++;
        });
        Object.keys(category).forEach(key => {
          this.foundCategory.push(
            {
              key: key,
              count: category[key]
            }
          );
        });
        this.filterTestListData('all');
      },
      error => {
        const err = JSON.parse(error._body);
        this.alertService.error(err.error.message);
        this.loading = false;
      });
  }

  filterTestListData(category) {
    this.activeCategory = category;
    if (category === 'all') {
      this.filteredList = this.onlinetests;
    } else {
      this.filteredList = this.onlinetests.filter(test => test['category'] === category);
    }
  }

  returnSanitizedDescription(index) {
    const sanitizedStr = this.onlinetests[index].description.replace(/<(?:.|\n)*?>/gm, '')
    if (sanitizedStr.length > 30) {
        return sanitizedStr.replace(/\r?\n|\r/g, '').replace(/^(.{30}[^\s]*).*/, "$1").replace(/&nbsp;/gi," ") + '...'; 
    } else {
        return sanitizedStr;
    }
  }

  onEnvironmentClick(_id) {
    this._testId = _id;
  }

  getCurrentUserId() {
        return JSON.parse(localStorage.getItem('currentUser'));
  }

  openPreviewTestModal(content, index) {
    this.previewOnlineTest = this.filteredList[index];
    const ngbModalOptions: NgbModalOptions = {
      size: 'lg'
    };
    this.modalReference = this.modalService.open(content, ngbModalOptions);
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

  previewTest() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    let msg = 'Launch a preview for this test?\nThis will boot up a machine for you to go through the complete candidate experience for this test.';
    if (this.previewOnlineTest.isWebBasedTest) {
      msg = 'Launch a preview for this test?';
    }
    const r = confirm(msg);
    if (r === true) {
      window.open("http://"+window.location.host+"/candidate/preview/"+this.previewOnlineTest.id + "/" + currentUser.userId, '_blank');   
    }
  }

}
