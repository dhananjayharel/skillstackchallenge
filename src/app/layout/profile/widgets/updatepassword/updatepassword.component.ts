import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { AlertService, AuthenticationService } from '../../../../shared';

@Component({
  selector: 'app-update-password',
  templateUrl: './updatepassword.component.html',
  styleUrls: ['./updatepassword.component.scss']
})
export class UpdatepasswordComponent implements OnInit {

  public resetPasswordForm: FormGroup;
  public loading = false;
  public events: any[] = [];
  public _id: string;
  public _uid: number;
  @Input() email: string;
  @Output() onPasswordUpdated: EventEmitter<string> = new EventEmitter();
  public submitted = false;
  constructor(
      private _fb: FormBuilder,
      private authenticationService: AuthenticationService,
      private alertService: AlertService) { }

  ngOnInit() {
      this.prepareForm();
  }

  prepareForm() {
      this.resetPasswordForm = this._fb.group({
           password: [null, Validators.compose([Validators.required, Validators.minLength(4)])],
           confirmPassword: [null, Validators.compose([Validators.required,Validators.minLength(4)])],
      },  {validator: this.pwdMatchValidator});

      // subscribe to form changes
      this.subcribeToFormChanges();
  }
  pwdMatchValidator(frm: FormGroup) {
	return frm.controls['password'].value === frm.controls['confirmPassword'].value ? null : {'mismatch': true};
 }

  subcribeToFormChanges() {
      const myFormStatusChanges$ = this.resetPasswordForm.statusChanges;
      const myFormValueChanges$ = this.resetPasswordForm.valueChanges;
      myFormStatusChanges$.subscribe(x => this.events.push({ event: 'STATUS_CHANGED', object: x }));
      myFormValueChanges$.subscribe(x => this.events.push({ event: 'VALUE_CHANGED', object: x }));
  }

  onResetPassword(resetPasswordForm, isValid: boolean) {
      this.submitted = true;
      // localStorage.setItem('isLoggedin', 'true');
      if (isValid) {
          this.doResetPassword(resetPasswordForm);
      }
  }

  doResetPassword (resetPasswordForm) {
    const currentUserData = JSON.parse(localStorage.getItem('currentUserData'));
      this.loading = true;
      this.authenticationService.resetPassword(resetPasswordForm.password, this.email, currentUserData._id)
          .subscribe(
              data => {
                  this.alertService.success('Your password has been successfully updated.', true);
                  this.onPasswordUpdated.emit('complete');
              },
              error => {
                  const err = JSON.parse(error._body);
                  this.alertService.error(err.error.message);
                  this.loading = false;
              });
  }

  onClose() {
    this.onPasswordUpdated.emit('cancelled');
  }

}
