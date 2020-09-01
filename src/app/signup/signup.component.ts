import {
  Component,
  OnInit
} from '@angular/core';
import {
  TranslateService
} from '@ngx-translate/core';
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
  User
} from '../../models';
import {
  AlertService,
  UserService,
  EnvironmentService,
  AuthenticationService
} from '../shared/';
declare var require: any;

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {
  public signUpForm: FormGroup;
  public loading = false;
  public submitted: boolean;
  public events: any[] = [];
  public returnUrl: string;
  public countryOptions: any[];
  private formStatus = true;

  constructor(private translate: TranslateService,
    private route: ActivatedRoute,
    private router: Router,
    private _fb: FormBuilder,
    private userService: UserService,
    private alertService: AlertService,
    private environmentService: EnvironmentService,
    private _authService: AuthenticationService) {}

  ngOnInit() {
    this.countryOptions = require('../shared/static/countries.json');
    this.signUpForm = this._fb.group({
      email: [null, Validators.compose([Validators.required, Validators.minLength(1)])],
      password: [null, Validators.compose([Validators.required, Validators.minLength(4)])],
      confirmPassword: [null, Validators.compose([Validators.required, Validators.minLength(4)])],
      fullname: [null, Validators.compose([Validators.required, Validators.minLength(1), Validators.maxLength(100)])],
      // phoneno: [null,
      //   Validators.compose([Validators.required, Validators.pattern('^[0-9]*$'), Validators.minLength(1), Validators.maxLength(10)])],
      companyname: [null, Validators.compose([Validators.required, Validators.minLength(1), Validators.maxLength(100)])],
      country: [null, Validators.compose([Validators.required, Validators.minLength(1), Validators.maxLength(20)])],
      // jobtitle: [null, Validators.compose([Validators.required, Validators.minLength(1), Validators.maxLength(20)])],
      });

    // subscribe to form changes
    this.subcribeToFormChanges();

    this.returnUrl = '/login';
  }

  subcribeToFormChanges() {
    const myFormStatusChanges$ = this.signUpForm.statusChanges;
    const myFormValueChanges$ = this.signUpForm.valueChanges;
    myFormStatusChanges$.subscribe(x => this.events.push({
      event: 'STATUS_CHANGED',
      object: x
    }));
    myFormValueChanges$.subscribe(x => this.events.push({
      event: 'VALUE_CHANGED',
      object: x
    }));
  }

  onSignUp(model: User, isValid: boolean) {
    console.log(isValid);
	this.submitted = true;
    if (isValid) {
			this.formStatus=true;
      
      this.loading = true;
      const freeDomains = require('../shared/static/freeDomains.json');
      const inputEmailDomain = model.email.replace(/.*@/, '');
      	  //dj: for now bypass business email verification
	  //if(false){ 
      if (freeDomains.includes(inputEmailDomain)) {
        this.alertService.error('Please use your company or business email to register an account.');
        this.loading = false;
        this.submitted = false;
      } else {
        this.doSignUp(model);
      }

      // this._authService.validateEmail(model.email)
      //   .subscribe(
      //     data => {
      //       if (data.format_valid && !data.free) {
      //         this.doSignUp(model);
      //       } else {
      //         this.alertService.error('Please use your company or business email to register an account.');
      //       }
      //     },
      //     error => {
      //       this.alertService.error('Email doesnt seem to be valid.');
      //     }
      //   );
    }
	else{
	this.formStatus=false;
	}
  }

  doSignUp(model: User) {
    this.loading = true;
    this.userService.create(model)
      .subscribe(
        data => {
          if (data.data) {
            data = data.data;
          }
          this.cloneEnvironments(data);
          this.loading = false;
          this.router.navigate([this.returnUrl]);
          this.alertService.success('A verification email is sent to your registered email. Please verify your email before login.', true);
        },
        error => {
          const err = JSON.parse(error._body);
          if (err.error.message.includes('Email already exists')) {
            this.alertService.error('Email already exists.');
          } else {
            this.alertService.error(err.error.message);
          }

          this.loading = false;
        });
  }

  changeLang(language: string) {
    this.translate.use(language);
  }

  cloneEnvironments(user) {
    this.environmentService.cloneEnvironments(user.id)
      .subscribe(
        data => {
          this.router.navigate([this.returnUrl]);
          // this.alertService.success('User has been succesfully signed up! ', true);
        },
        error => {
          const err = JSON.parse(error._body);
          this.alertService.error(err.error.message);
          this.loading = false;
        });
  }
}
