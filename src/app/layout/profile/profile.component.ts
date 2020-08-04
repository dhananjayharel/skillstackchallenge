import {
  Component,
  OnInit,
  ViewChild
} from '@angular/core';
import {
  Router,
  ActivatedRoute
} from '@angular/router';
import {
  FormGroup,
  FormControl,
  FormBuilder,
  Validators
} from '@angular/forms';
import {
  AlertService,
  AuthenticationService,
  UserService
} from '../../shared/services/index';
import {
  Observable
} from 'rxjs/Rx';
import {
  NgbModal,
  ModalDismissReasons
} from '@ng-bootstrap/ng-bootstrap';
declare var require: any;

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})


export class ProfileComponent implements OnInit {
  public editUserForm: FormGroup;
  public loading = false;
  public submitted: boolean;
  public events: any[] = [];
  public countryOptions: any[];
  public returnUrl: string;
  public editUser: any;
  private modalReference: any;
  private closeResult: string;
  @ViewChild('updatePasswordModal') psswdModal: any;

  constructor(private route: ActivatedRoute,
    private router: Router,
    private _fb: FormBuilder,
    private modalService: NgbModal,
    private userService: UserService,
    private alertService: AlertService) {}

  ngOnInit() {
    this.countryOptions = require('../../shared/static/countries.json');
    this.editUserForm = this._fb.group({
      email: [null, Validators.compose([Validators.required, Validators.minLength(1)])],
      //  password: [null, Validators.compose([Validators.required, Validators.minLength(4), Validators.maxLength(10)])],
      //  confirmPassword: [null, Validators.compose([Validators.required, Validators.minLength(4), Validators.maxLength(10)])],
      fullname: [null, Validators.compose([Validators.required, Validators.minLength(1), Validators.maxLength(20)])],
      companyname: [null, Validators.compose([Validators.required, Validators.minLength(1), Validators.maxLength(100)])],
      phoneno: [null,
        Validators.compose([Validators.required, Validators.pattern('^[0-9]*$'), Validators.minLength(1), Validators.maxLength(10)])
      ],
      companysize: [null, Validators.compose([Validators.required, Validators.minLength(1), Validators.maxLength(20)])],
      country: [null, Validators.compose([Validators.required, Validators.minLength(1), Validators.maxLength(20)])],
      jobtitle: [null, Validators.compose([Validators.required, Validators.minLength(1), Validators.maxLength(20)])],
      id: []
    });

    // subscribe to form changes  
    this.subcribeToFormChanges();

    this.returnUrl = '/test';

    let currentUserData = JSON.parse(localStorage.getItem('currentUserData'));
    this.editUser = JSON.parse(localStorage.getItem('currentUserData'));

    if (currentUserData) {
      ( < FormControl > this.editUserForm.controls['email'])
      .setValue(currentUserData.email, {
        onlySelf: true
      });
      ( < FormControl > this.editUserForm.controls['fullname'])
      .setValue(currentUserData.fullname, {
        onlySelf: true
      });
      ( < FormControl > this.editUserForm.controls['id'])
      .setValue(currentUserData.id, {
        onlySelf: true
      });

      ( < FormControl > this.editUserForm.controls['companyname'])
      .setValue(currentUserData.companyname, {
        onlySelf: true
      });
      ( < FormControl > this.editUserForm.controls['companysize'])
      .setValue(currentUserData.companysize, {
        onlySelf: true
      });
      ( < FormControl > this.editUserForm.controls['jobtitle'])
      .setValue(currentUserData.jobtitle, {
        onlySelf: true
      });
      ( < FormControl > this.editUserForm.controls['phoneno'])
      .setValue(currentUserData.phoneno, {
        onlySelf: true
      });
      ( < FormControl > this.editUserForm.controls['country'])
      .setValue(currentUserData.country, {
        onlySelf: true
      });
    }
  }

  subcribeToFormChanges() {
    const myFormStatusChanges$ = this.editUserForm.statusChanges;
    const myFormValueChanges$ = this.editUserForm.valueChanges;

    myFormStatusChanges$.subscribe(x => this.events.push({
      event: 'STATUS_CHANGED',
      object: x
    }));
    myFormValueChanges$.subscribe(x => this.events.push({
      event: 'VALUE_CHANGED',
      object: x
    }));
  }

  onEditUser(model: any, isValid: boolean) {
    console.log(model);
    this.submitted = true;
    if (isValid)
      this.doEditUser(model);
  }

  doEditUser(model: any) {
    console.log("insignup");
    this.loading = true;
    this.userService.update(model)
      .subscribe(
        data => {
          console.log(data);
          localStorage.setItem('currentUserData', JSON.stringify(data));
          this.router.navigate([this.returnUrl]);
          this.alertService.success("Your details have been updated successfully!", true);
          this.loading = false;
        },
        error => {
          var err = JSON.parse(error._body);
          this.alertService.error(err.error.message);
          this.loading = false;
        });
  }

  openUpdatePasswordModal() {
    this.openModal(this.psswdModal, {});
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

  onPasswordUpdated($event) {
    if ($event === 'complete' || $event === 'cancelled') {
      this.modalReference.close();
    }
  }
}
