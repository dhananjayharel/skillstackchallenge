import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { AlertService, OnlineTestService } from '../../../../shared';
import { HostListener } from '@angular/core';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'app-clonetest',
  templateUrl: './clonetest.component.html',
  styleUrls: ['./clonetest.component.scss']
})
export class ClonetestComponent implements OnInit {
  public cloneTestForm: FormGroup;
  public events: any[] = [];
  public submitted = false;
  constructor(  private _fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private _onlineTestService: OnlineTestService,
    private alertService: AlertService) {
  }

  ngOnInit() {
    this.prepareForm();
  }

  prepareForm() {
    this.cloneTestForm = this._fb.group({
      // onlineTestName: [null, Validators.compose([Validators.required, Validators.minLength(1)])],
      onlineTestId: [null, Validators.compose([Validators.required, Validators.minLength(4)])],
    });
    // subscribe to form changes
    this.subcribeToFormChanges();
  }

  subcribeToFormChanges() {
    const myFormStatusChanges$ = this.cloneTestForm.statusChanges;
    const myFormValueChanges$ = this.cloneTestForm.valueChanges;
    myFormStatusChanges$.subscribe(x => this.events.push({ event: 'STATUS_CHANGED', object: x }));
    myFormValueChanges$.subscribe(x => this.events.push({ event: 'VALUE_CHANGED', object: x }));
  }

  onTestSelect (testId) {
    this.onFormSubmit();
  }
  onFormSubmit () {

    if (this.cloneTestForm.valid) {
      this.submitted = true;
      const currentUser = JSON.parse(localStorage.getItem('currentUser'));

      const data = {
          testid: this.cloneTestForm.value.onlineTestId,
          onlinetestname: '',
          userid: currentUser.userId
      };
      console.log("Clone test began");
      console.log(data);

      this._onlineTestService.clone(data)
      .subscribe( response => {
        console.log(response);
        this.alertService.success('The online test is cloned successfully');
        this.router.navigate(['/test']);
      });
    }
  }

  onCancel() {
    this.router.navigate(['/test']);
  }

  @HostListener('window:beforeunload')
  canDeactivate(): Observable<boolean> | boolean {
    // insert logic to check if there are pending changes here;
    // returning true will navigate without confirmation
    // returning false will show a confirm dialog before navigating away

    return this.events.length === 0 || this.submitted;
  }
}
