import { Component, OnInit, Input, Output, AfterViewInit, OnDestroy, EventEmitter } from '@angular/core';
import { Candidate, OnlineTest } from '../../../../../models';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { AlertService, CandidateService, UserService } from './../../../../shared';
import { Router } from '@angular/router';

@Component({
    selector: 'onlinetest-candidiates-form',
    templateUrl: './onlinetestcandidiateform.component.html',
})
export class OnlineTestCandidiateFormComponent implements OnInit, OnDestroy {

    public candidateForm: FormGroup;
    private currentUser: any;
    public editor: any;
    public submitted: boolean;
    public events: any[] = [];
    public loading: boolean;
    public returnUrl: string;
    public messageBody: string;
    @Input() testOnline: OnlineTest;
    @Input() candidate: Candidate;
    @Output() onCandidateInvite: EventEmitter<string> = new EventEmitter();
    @Output() onWidgetClosed: EventEmitter<string> = new EventEmitter();

    constructor(private _fb: FormBuilder,
                private candidateService: CandidateService,
                private userService: UserService,
                private alertService: AlertService,
                private router: Router) { }

    ngOnInit() {
      this.currentUser = JSON.parse(localStorage.getItem('currentUserData'));
      console.log(this.currentUser)
      let currentTime = Math.floor(Date.now() / 1000);
      if (this.currentUser.activePlan
        && this.currentUser.activePlan.endTime > currentTime
        && this.currentUser.activePlan.inviteUserCount > 0) {
          this.initForm();
          this.subcribeToFormChanges();
      } else {
        this.alertService.error('You dont have an active plan. Please upgrade your plan to start inviting the candidates.');
        this.router.navigate(['/price-plan']);
      }
    }

    // ngAfterViewInit() {
    // }

    initForm() {
        this.submitted = false;
        if (this.candidate) {
            this.candidateForm = this._fb.group({
                fullname: [this.candidate['fullname'], [<any>Validators.required, <any>Validators.minLength(5)]],
                email: [this.candidate.email, Validators.required],
                subject: [this.getDefaultEmailSubject(), Validators.required],
                message: [this.getDefaultEmailTemplate()],
            });
        } else {
            this.candidateForm = this._fb.group({
                fullname: ['', [<any>Validators.required, <any>Validators.minLength(5)]],
                email: ['', Validators.required],
                subject: [this.getDefaultEmailSubject(), Validators.required],
                message: [this.getDefaultEmailTemplate()],
            });
        }
    }

    onReset() {
        this.candidateForm = this._fb.group({
            fullname: ['', [<any>Validators.required, <any>Validators.minLength(5)]],
            email: ['', Validators.required],
            subject: [this.getDefaultEmailSubject(), Validators.required],
            message: [this.getDefaultEmailTemplate()],
        });
    }

    subcribeToFormChanges() {
        const myFormStatusChanges$ = this.candidateForm.statusChanges;
        const myFormValueChanges$ = this.candidateForm.valueChanges;

        myFormStatusChanges$.subscribe(x => this.events.push({ event: 'STATUS_CHANGED', object: x }));
        myFormValueChanges$.subscribe(x => this.events.push({ event: 'VALUE_CHANGED', object: x }));
    }


    save(model: Candidate, isValid: boolean) {
        this.submitted = true;
        console.log(model, isValid);

        if (isValid) {
            console.log(this.messageBody);
            model['subject'] = model['subject'].replace('%Firstname%', model['fullname'].split(' ')[0]);
            model['message'] = model['message'].replace('%Fullname%', model['fullname']);
            if (this.candidate) {
                this.reInviteCandidate(model);
            } else {
                this.inviteCandidate(model);
            }

        }
    }

    inviteCandidate(model) {
        this.loading = true;
        model.onlineTestId = this.testOnline.id;
        model.status = 'invited';
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        if (currentUser.userId) {
          const firstName = model.fullname.split(' ')[0];
          model.uid = currentUser.userId;
          model.meta = {
            subject: model.subject
          };
        }

        this.candidateService.create(model)
            .subscribe(
                data => {
                    this.alertService.success('The candidate has been invited.', true);
                    this.onCandidateInvite.emit('complete');
                    this.updateUserInviteCount();
                    // this.loading = false;
                    // this.initForm();
                    // this.initTinyMce();
                },
                error => {
                    const err = JSON.parse(error._body);
                    this.alertService.error(err.error.message);
                    this.loading = false;
                });
    }

    reInviteCandidate(model) {
        this.loading = true;
        this.candidate['fullname'] = model.fullname;
        this.candidate.email = model.email;
        this.candidateService.update(this.candidate)
            .subscribe(
                data => {
                    this.alertService.success('The candidate has been re-invited.', true);
                    this.onCandidateInvite.emit('complete');
                    // this.loading = false;
                    // this.initForm();
                    // this.initTinyMce();
                },
                error => {
                    const err = JSON.parse(error._body);
                    this.alertService.error(err.error.message);
                    this.loading = false;
                });
    }

    updateUserInviteCount() {
      this.currentUser.activePlan.inviteUserCount -= 1;
      this.userService.update(this.currentUser)
      .subscribe(
        data => {
          console.log(data);
          localStorage.setItem('currentUserData', JSON.stringify(data));
        },
        error => {
          const err = JSON.parse(error._body);
          this.alertService.error(err.error.message);
          this.loading = false;
        });
    }

    ngOnDestroy() {
        tinymce.remove(this.editor);
        this.onWidgetClosed.emit('clear');
    }

    getDefaultEmailSubject () {
        const companyName = this.currentUser.companyname || 'YOUR COMPANY NAME';
        let subject =
        '%Firstname% - ' + companyName + ' has invited you for an online test on %category% - EXPIRES IN 3 DAYS';
        if (this.testOnline['category']) {
            const languageOptions = require('../../../../shared/static/language.json');
            const category = languageOptions.find(item => item.value === this.testOnline['category']);
            if (category) {
                subject = subject.replace('%category%', category.label);
            } else {
                subject = subject.replace('%category%', 'TECHNOLOGY_NAME');
            }
        }
        return subject;
    }

    getDefaultEmailTemplate() {
      const companyName = this.currentUser.companyname || 'YOUR COMPANY NAME';
        return '<p><span style="color: rgb(51, 51, 51); font-family: Arial, sans-serif;">Dear %Fullname%,</span></p>'+
'<p style="margin: 10px 0px 0px; padding: 0px; color: rgb(51, 51, 51); font-family: Arial, sans-serif;">You have been invited by '+ companyName +' to attend the <em>'+this.testOnline.name+'</em> test. You can take this test any time within the next 3 days.</p>'+

'<p style="margin: 10px 0px 0px; padding: 0px; color: rgb(51, 51, 51); font-family: Arial, sans-serif;"><div style="margin: 1.25rem 0;width:100%; text-align:center;"><a href="%invite_url%" style="color: #fff;background-color: #025aa5;padding: 0.5rem 1rem;font-size: 1rem;line-height: 1.25;border-radius: 0.25rem;white-space: nowrap;border-color: #01549b;">Start Challenge</a></div><br>You can also use this link %invite_url%  to access the challenge.</p>'+

'<p style="margin: 10px 0px 0px; padding: 0px; color: rgb(51, 51, 51); font-family: Arial, sans-serif;">Test platform provided by SkillStack.com. Please directly contact the company that sent you the invite for questions on scheduling or evaluating your test.&nbsp;</p>'+
        '';
    }

}
