import {
    Component,
    OnInit,
    OnDestroy,
    ViewChild,
    ChangeDetectorRef
} from '@angular/core';
import {
    Router,
    ActivatedRoute
} from '@angular/router';
import 'rxjs/add/operator/mergeMap';
import {
    FormGroup,
    FormControl,
    FormBuilder,
    Validators
} from '@angular/forms';
import {
    AlertService,
    AuthenticationService,
    CandidateService,
    EnvironmentService,
    AwsService,
    OnlineTestService,
    PushNotificationService,
    ScriptService
} from '../shared/services/index';
import {
    Observable
} from 'rxjs/Rx';
import {
    OnlineTest
} from '../../models/onlinetests.interface';
import {
    NgbModal,
    NgbModalOptions,
    ModalDismissReasons
} from '@ng-bootstrap/ng-bootstrap';
const RecordRTC = require('recordrtc/RecordRTC.min');
const Vimeo = require('vimeo').Vimeo;
declare var PipeSDK: any;
import sdk from '@stackblitz/sdk';

@Component({
    selector: 'app-candidate',
    templateUrl: './candidate.component.html',
    styleUrls: ['./candidate.component.scss']
})

export class CandidateComponent implements OnInit, OnDestroy {
    public enrollTestForm: FormGroup;
    public loading = false;
    public submitted: boolean;
    public events: any[] = [];
    public returnUrl: string;
    public _id: string;
    public candidate: any;
    public solutionDetails: any[] = [];
    public showMachineDetails: boolean;
    public environment: any[] = [];
    public statusText: string;
    public launchStarted: boolean;
    public instanceid: string;
    public currentStatus: string;
    public onlineTest: OnlineTest;
    public machinePassword: string;
    public prefetchedMachinePassword: string;
    public testStarted = false;
    public testFinished = false;
    public rdpLink: string;
    public publicIp: string;
	public editorPort = "3000";
	public outPutPort = "-999";
    public countDownTimer: string;
    private closeResult: string;
    private modalReference: any;
    public awsLaunchStatusCount = 10;
    public status = 'TEST_LOAD';
    public previewMode = false;
    public technology = '';
    public _previewTestId: number;
    public clock: any;
    public hoursSpan: any;
    public minutesSpan: any;
    public secondsSpan: any;
    public endtime: any;
    public timeinterval: any;
    public currentObject: any;
    private recordRTC: any;
    private vimeoClient: any;
    private startClicked = false;
    private stream: MediaStream;
    private _videoURL: string;
    public videoUploadStatus: string;
    public _interviewRecState: string;
    public webcamSuccess = false;
    public webCamEnabled = false;
    public webCamPermissionAsked = false;
    public recorderObject: any;
    public uploadPercentage = 0;
    public updateProgress = null;
    public webCameEnabled = true;
    public webBasedTest = true;
    public mcqDuration = 0;
    public totalTestDuration = 0;
    private vm: any;
    private taskId = '';
    private iframeCheckingInterval = null;
    private httpRequestCheckingInterval = null;
    private totalSecs = 90;
    public hour: number = 0;
    public min: number = 0;
    public sec: number = 0;
    public countDownId2: any;
	public containerPath = "";
	private c = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
	private ecsLaunchType = "EC2";	
    @ViewChild('launchMachineModal') launchMachineModal: any;
    @ViewChild('testDetailsModal') testDetailsModal: any;
    @ViewChild('testQuestionModal') testQuestionModal: any;
    @ViewChild('video') video;
    @ViewChild('video2') video2;


    constructor(
        private _fb: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private authenticationService: AuthenticationService,
        private candidateService: CandidateService,
        private alertService: AlertService,
        private awsService: AwsService,
        private onlineTestService: OnlineTestService,
        private environmentService: EnvironmentService,
        private notifyService: PushNotificationService,
        private modalService: NgbModal,
        private script: ScriptService,
        private changeDetectionRef: ChangeDetectorRef) {
        let currentUrl = window.location.href;
        if (currentUrl.startsWith('http:')) {
            currentUrl = currentUrl.replace('http:', 'https:');
            //    window.location.href = currentUrl;
        }
    }

    ngOnInit() {
        this.script.load('pipe').then(data => {
            console.log('script loaded ', data);
        }).catch(error => console.log(error));
        if (this.route.snapshot.paramMap.has('testid')) {
            this.previewMode = true;
            this._previewTestId = this.route.snapshot.params['testid'];
            console.log('testid=' + this._previewTestId);
            this.loading = true;
            let currentUserData = JSON.parse(localStorage.getItem('currentUserData'));

            this.candidate = {
                AmiId: '',
                LaunchedFromStoppedInstance: false,
                fullname: ''
            };
            let name = '';
            if (currentUserData != null) {
                name = currentUserData.fullname;
            }
            if (name.match(/\s/)) {
                name = name.substring(0, name.indexOf(' '));
            }
            this.candidate.fullname = name;
            this.prepareForm(this.candidate);
            this.loadTestDetails(this._previewTestId);
        } else {
            this._id = this.route.snapshot.params['id'];
            this.loading = true;
            const filter = {
                'where': {
                    'testToken': this._id
                }
            };
            this.fetchCandidate(filter);
        }
        this.showMachineDetails = false;
        this.machinePassword = '';
        this.launchStarted = false;
        this.countDownTimer = '300';
        this.vimeoClient = new Vimeo('40001c1b43a189f352954e896265e2f068bf54fc',
            'zgSAd4n8qNb+ODpKWPq/FU/1XEnUnUsnSK8Pn2+qiIyFEKf7+tMIMp2foDd/YQ5dU15l9Bpy8SGDXBiY3nWzZRSb+t0JdH2SNdWX8w+9lMBxnqTgrX1nCIReC4IHwC2z',
            '7626eb6d8f8abe2b4efee1b8b8b7c8a9');
    }

    ngOnDestroy() {
        this.notifyService.close();
    }

    openModal(content, config = null) {

        let ngbModalOptions: NgbModalOptions = {
            backdrop: 'static',
            keyboard: false
        };
        if (config) {
            ngbModalOptions = config;
        }
        console.log(ngbModalOptions)
        this.modalReference = this.modalService.open(content, ngbModalOptions);
        this.modalReference.result.then((result) => {
            this.closeResult = `Closed with: ${result}`;
        }, (reason) => {
            setTimeout(function () {
                document.getElementById('testWindow').focus();
            }, 500);
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

    socketServerInit() {
        const solution = {
            id: '',
            candidateName: '',
            testId: 0,
            instanceId: '',
            pwd: '',
            envId: 0,
            publicIp: '',
            ip: '',
            testDuration: 0
        };

        solution.id = this.candidate.id;
        solution.testId = this.onlineTest.id;
        solution.candidateName = this.candidate.fullname;
        solution.instanceId = this.candidate.instanceId;
        solution.pwd = this.prefetchedMachinePassword;
        solution.envId = this.onlineTest.envId;
        solution.publicIp = this.publicIp;
        solution.ip = this.publicIp;
        solution.testDuration = this.onlineTest['duration'];

        this.notifyService.initializeCandidateConnection(solution);
        this.notifyService.onCandidateMachineSetupComplete().subscribe(obj => {
            console.log(obj);
        });

        this.notifyService.onFinishTest().subscribe(obj => {
            console.log(obj);
            this.stopTest();
            this.status = 'CODING_TEST_END';
        });
    }

    onMachineLaunched($event) {
        console.log($event);

        if ($event.publicIp) {
            this.publicIp = $event.publicIp;
            this.socketServerInit();
        }
    }

    fetchCandidate(filter) {


        this.candidateService.getAll(filter)
            .subscribe(
                data => {
                    // if (data.length > 0) {
                    this.candidate = data[0];
                    console.log(this.candidate)
                    //    if (this.candidate.status === 'invited') {
                    this.prepareForm(this.candidate);
                    if (this.candidate.instanceId.trim().length > 0) {
                        this.instanceid = this.candidate.instanceId;
                    }
                    this.loadTestDetails(this.candidate.onlineTestId);
                    // }  else {
                    //     this.alertService.success('Test already taken!', true);
                    //     this.router.navigate(['/login']);
                    // }
                    // } else {
                    //    this.router.navigate(['/not-found']);
                    // }
                },
                error => {
                    const err = JSON.parse(error._body);
                    this.alertService.error(err.error.message);
                    this.loading = false;
                });
    }

    prepareForm(candidate) {

        if (candidate.fullname === 'Anonymous user') {
            this.enrollTestForm = this._fb.group({
                fullname: [null, Validators.compose([Validators.required, Validators.minLength(1), Validators.maxLength(20)])],
                email: [null, Validators.compose([Validators.required, Validators.minLength(1)])],
                mobilenumber: [null, Validators.compose([Validators.required, Validators.minLength(10)])],
                linkedinprofile: [null, Validators.compose([Validators.required])],
                accept: [null, Validators.compose([Validators.required])],
            });
        } else {
            this.enrollTestForm = this._fb.group({
                accept: [null, Validators.compose([Validators.required])],
            });
        }

        // subscribe to form changes
        this.subcribeToFormChanges();

        // get return url from route parameters or default to '/'
        this.returnUrl = '/dashboard';
    }

    subcribeToFormChanges() {
        const myFormStatusChanges$ = this.enrollTestForm.statusChanges;
        const myFormValueChanges$ = this.enrollTestForm.valueChanges;
        myFormStatusChanges$.subscribe(x => this.events.push({
            event: 'STATUS_CHANGED',
            object: x
        }));
        myFormValueChanges$.subscribe(x => this.events.push({
            event: 'VALUE_CHANGED',
            object: x
        }));
    }

    onTestEnrolled(enrollTestForm, isValid: boolean) {
        this.submitted = true;

        if (isValid && enrollTestForm.accept) {
            if (this.candidate.fullname === 'Anonymous user') {
                this.candidate.fullname = enrollTestForm.fullname;
                this.candidate.email = enrollTestForm.email;
                this.candidate['mobilenumber'] = enrollTestForm.mobilenumber;
                this.candidate['linkedinprofile'] = enrollTestForm.linkedinprofile;
            }

            this.candidate.startTestTime = Math.floor(Date.now() / 1000);
            this.candidate.expectedEndTime = this.candidate.startTestTime + this.totalTestDuration;
            this.candidateService.update(this.candidate)
                .subscribe(
                    data => {
                        this.doEnroll(enrollTestForm);
                    },
					error=>{
						console.log("err");
						 this.doEnroll(enrollTestForm);
					}
					);
        } else {
            this.submitted = false;
        }
    }

    doEnroll(enrollTestForm) {
		/* Launch the contianr on start test only
        setTimeout(() => { 
            this.loadStackBlitzEditor();
        }, 0);
        */
        // this.status = 'OBJECTIVE_TEST_BEGIN';

        if (!this.onlineTest['hideMcqTest'] && !this.candidate.mcqQuestionResponse) {
            this.status = 'OBJECTIVE_TEST_BEGIN';
        } else {
            this.status = 'CODING_TEST_START';
        }

        // else if (this.onlineTest.isWebBasedTest) {
        //     console.log('this web enabled test');
        //     //this.status = 'LOADING_STACKBLITZ';
        // } else {
        //     this.showMachineDetails = true;
        //     this.checkIfStoppedMachineAvailable();
        // }
        // DJ COMMENTED BELOW 2 LINES
        // this.status = 'TEST_LOAD_WINDOW';
        // this.showMachineDetails = true;
        // this.checkIfStoppedMachineAvailable();
    }

    startMcqTest() {
        this.status = 'OBJECTIVE_TEST_START';
    }

    ifObjectiveTestFinished($quizResponse) {
        if ($quizResponse && !this.previewMode) {
            this.candidate['mcqQuestions'] = this.onlineTest.mcqQuestions;
            this.candidate['mcqQuestionResponse'] = $quizResponse;
            let score = 0;
            $quizResponse = JSON.parse($quizResponse)
            $quizResponse.forEach(_question => {
                _question.options.forEach(_option => {
                    if (_option.isAnswer && _option.selected) {
                        score++;
                    }
                })
            })
            this.candidate['score'] += score;
            this.candidateService.update(this.candidate)
                .subscribe(
                    data => {
                        this.status = 'OBJECTIVE_TEST_END';
                    });
        } else if (this.previewMode) {
            this.status = 'OBJECTIVE_TEST_END';
        }
    }

    _continueToProgramming() {
        this.status = 'CODING_TEST_START';
    }


    _startProgrammingTest() {
        if (this.onlineTest.enableWebCamRecording) {
            this.status = 'WEBCAM_CHECKING';
        } else if (this.onlineTest.isWebBasedTest) {
            if (this.rdpLink) {
                this.status = 'TEST_OPEN_WINDOW';
            } else {
                this.status = 'LOADING_STACKBLITZ';
                this.startCountDown();
            }
             setTimeout(() => {
             this.loadStackBlitzEditor();
             }, 0);
        } else {
            this.showMachineDetails = true;
            this.checkIfStoppedMachineAvailable();
            // this.status = 'TEST_INITIAL';
        }
    }

    startTest() {
        // this.loading = true;
        if (this.onlineTest.isWebBasedTest) {
            console.log('this is web enabled test');
            this.status = 'LOADING_STACKBLITZ';
            setTimeout(() => { //<<<---    using ()=> syntax
                this.loadStackBlitzEditor();
            }, 0);
        } else {
            this.status = 'TEST_LOAD_WINDOW';
            this.showMachineDetails = true;
            this.checkIfStoppedMachineAvailable();
        }
    }

    launchInstance() {
        this.statusText = 'Checking....';
        this.instanceid = '';
        const instanceToLaunch = this.onlineTest.environment;

        this.awsService.launchInstance(instanceToLaunch)
            .subscribe(
                data => {
                    console.log('launching instance');
                    this.instanceid = data.instanceId;
                    this.candidate.instanceId = data.instanceId;
                    this.candidate.testStarted = true;

                    this.monitor();
                    this.statusText = 'Launching...';
                    // now update environment

                    this.candidateService.update(this.candidate)
                        .subscribe(
                            data => {
                                console.log('launching instance');
                                console.log(data);
                                this.candidate = data;
                            },
                            error => {
                                const err = JSON.parse(error._body);
                                // dj:commented this.alertService.error(err.error.message);
                                this.loading = false;
                            });

                },
                error => {
                    const err = JSON.parse(error._body);
                    this.alertService.error(err.error.message);
                    this.loading = false;
                });

    }

    // dj:
    startInstance(instaceId) {
        this.statusText = 'Checking....';
        this.instanceid = '';
        const instanceToLaunch = this.onlineTest.environment;

        console.log(instanceToLaunch);
        this.awsService.startInstance(instaceId)
            .subscribe(
                data => {
                    console.log('launching stopped instance');
                    this.instanceid = instaceId;
                    this.candidate.instanceId = instaceId;
                    this.candidate.testStarted = true;

                    this.monitor();
                    this.statusText = 'Launching...';
                    // now update environment

                    this.candidateService.update(this.candidate)
                        .subscribe(
                            data => {
                                console.log('launching stopped instance');
                                console.log(data);
                                this.candidate = data;
                            },
                            error => {
                                const err = JSON.parse(error._body);
                                // dj:commented this.alertService.error(err.error.message);
                                this.loading = false;
                            });

                },
                error => {
                    const err = JSON.parse(error._body);
                    this.alertService.error(err.error.message);
                    this.loading = false;
                });

    }

    monitor() {
        this.loading = true;
        const stopTimer$ = Observable.timer(1 * 60 * 1000);
        const timer: any = Observable.timer(50, 4000).takeUntil(stopTimer$);

        const subscription = timer.subscribe(data => {

            if (this.currentStatus === 'initializing') {
                console.log('UNSUBSCRIB');
                // dj: Shifted two methods here bcz sometimes publcip is not available as soon as we launch the machine
                this.prefetchPassword();
                this.launchMachineEntry();
                subscription.unsubscribe();
                this.statusText = 'Done';
            }
            this.checkMachineStatus(subscription);
        });
    }
    checkMachineStatus(subscription) {
        this.awsService.getInstanceStatus(this.instanceid)
            .subscribe(
                data => {
                    console.log('x' + data);
                    if (data.error) {
                        console.log('in getstatus error retry again');
                        data.state = 'Machine not available';
                        this.currentStatus = 'Remote machine not available';
                        // this.instanceid = '';
                        this.awsLaunchStatusCount--;
                        if (this.awsLaunchStatusCount < 0) {
                            console.log('aws api error');
                            subscription.unsubscribe();
                            this.instanceid = '';
                        }
                    }

                    this.currentStatus = data.state;
                    console.log('this.currentStatus' + this.currentStatus);

                    if (data.state === 'initializing') {
                        this.loading = false;
                    }
                },
                error => {
                    const err = JSON.parse(error._body);
                    subscription.unsubscribe();
                    this.alertService.error(err.error.message);
                },
                () => console.log('Monitor Status Complete')
            );

    }

    getPassword() {
        this.machinePassword = this.prefetchedMachinePassword;
    }

    launchMachineEntry() {
        const input = {
            type: 'candidate',
            inviteId: this._id,
            duration: this.onlineTest.duration,
            gitUrl: this.environment['git_url'],
            instanceId: this.instanceid,
            fullname: this.candidate.fullname,
            email: this.candidate.email,
            testId: this.onlineTest.id,
            candidateId: this.candidate.id,
            LaunchedFromStoppedInstance: this.candidate.LaunchedFromStoppedInstance
        };

        this.awsService.addMachinEntry(input)
            .subscribe(
                data => {
                    console.log(data);
                },
                error => {
                    const err = JSON.parse(error._body);
                    this.alertService.error(err.error.message);
                },
                () => console.log('Registered Machine')
            );
    }

    //For ecs
    launchMachineEntry_V2() {
        const input = {
            type: 'candidate',
            inviteId: this._id,
            duration: this.onlineTest.duration,
            gitUrl: this.environment['git_url'],
            instanceId: this.instanceid,
            fullname: this.candidate.fullname,
            email: this.candidate.email,
            testId: this.onlineTest.id,
            candidateId: this.candidate.id,
            publicIp: this.publicIp
        };

        this.awsService.addMachinEntry_V2(input)
            .subscribe(
                data => {
                    console.log(data);
                },
                error => {
                    const err = JSON.parse(error._body);
                    this.alertService.error(err.error.message);
                },
                () => console.log('Registered Machine for ECS')
            );
    }

    getRDPLink() {
        const inputs = {
            instanceId: this.instanceid,
            testToken: this._id,
            pwd: this.prefetchedMachinePassword
        };
        this.awsService.getRdpLink(inputs)
            .subscribe(
                data => {
                    console.log(data);
                    this.rdpLink = data.link;
                },
                error => {
                    const err = JSON.parse(error._body);
                    this.alertService.error(err.error.message);
                }
            );
    }

    prefetchPassword() {
        console.log('in prefetch pwd...');
        this.awsService.getPassword(this.onlineTest.environment)
            .subscribe(
                data => {
                    console.log('get password=' + data);
                    this.prefetchedMachinePassword = data.pwd;
                    this.getRDPLink();
                },
                error => {
                    const err = JSON.parse(error._body);
                    this.alertService.error(err.error.message);
                }
            );

    }

    showRDPDetails(event) {
        if (event === 'complete') {
            setTimeout(function () {
                document.getElementById('testWindow').focus();
            }, 3000);
            this.launchStarted = true;
            this.testStarted = true;
            this.status = 'TEST_OPEN_WINDOW';
            this.getPublicIp();
            this.updateCandidateTestStatus('ongoing');
            this.modalReference.close();
            const deadline = new Date(new Date().getTime() + this.onlineTest.duration * 60 * 1000);
            this.initializeClock('clockdiv', deadline);
            let app = document.getElementById('chromeapp');
            app.style.top = '0px';

            setTimeout(function () {
                document.getElementById('testWindow').focus();
            }, 5000);
        }
    }

    startCountDown() {
        this.testStarted = true;
        let deadline = new Date(new Date().getTime() + this.onlineTest.duration * 60 * 1000);
        this.initializeClock('clockdiv', deadline);
        let app = document.getElementById('chromeapp');
        app.style.top = '0px';
    }

    getPublicIp() {
        if (this.instanceid) {
            this.environmentService.getPublicIP(this.instanceid)
                .subscribe(
                    data => {
                        this.publicIp = data.ip;
                        this.socketServerInit();
                    },
                    error => {
                        const err = JSON.parse(error._body);
                        this.alertService.error(err.error.message);
                    });
        }
    }

    stopTestCountdown() {
        const r = confirm('Are you sure? \nYou will not be able to make any more changes to your code once this test has been marked as Finished.');
        if (r === true) {

            //if(this.onlineTest.testType=='web')monitor{
            if (true) {
                //web based test doesnt need socket event
                this.awsService.stopTask(this.taskId).subscribe(
                    data => {
                        console.log('stopped the task proceed to finish test');
                        console.log(data);
                        if (this.previewMode) {
                            console.log('Preview mode just stop the test');
                            this.stopTest();
                            this.status = 'CODING_TEST_END';
                        } else {
                            this.candidateService.finishTest(this.candidate.id).subscribe(
                                data => {
                                    console.log('Finish Test done.');
                                    this.stopTest();
                                    this.status = 'CODING_TEST_END';
                                },
                                error => {
                                    console.log('finish test api error');
                                });
                        }
                    },
                    error => {
                        console.log('stop task error');

                    });
            } else
            if (!this.webCamEnabled || !this.onlineTest.enableWebCamRecording) {
                console.log('ending finish test event to machine');
                const obj = {
                    ip: ''
                };
                obj.ip = this.publicIp;
                this.notifyService.triggerFinishTest(obj);
                console.log('triggerFinishTest event sent...');
            } else {
                // Stop recording and upload the video then only triggerFinishTest
                this.status = 'TEST_CLOSE_WINDOW';
                this.stopPipeRecording();
            }
        }
    }

    stopTest() {
        this.launchStarted = false;
        this.testStarted = false;
        this.testFinished = true;
        this.status = 'TEST_CLOSE_WINDOW';
        clearInterval(this.timeinterval);
    }

    updateCandidateTestStatus(status) {
        this.candidate.status = status;
        this.candidateService.update(this.candidate)
            .subscribe(
                data => {
                    console.log('Set candidate test status to ' + status);
                    if (status === 'completed') {
                        this.alertService.success('Congrats! Your test submission has been' +
                            ' successfully sent to the recruiters. They will get back to you' +
                            ' accordingly after viewing your solution. The test is over. You' +
                            ' may now close this tab.');
                    }
                },
                error => {
                    const err = JSON.parse(error._body);
                    this.alertService.error(err.error.message);
                    this.loading = false;
                });
    }
    // dj
    checkIfStoppedMachineAvailable() {
        this.awsService.getAvailableStoppedMachines(this.onlineTest.id)
            .subscribe(
                data => {
                    console.log(data);
                    console.log('testFinished=' + this.testFinished);
                    console.log('launchStarted=' + this.launchStarted);
                    if (data.length > 0) {
                        console.log('Got stopped instance now start that instance:' + data[0].InstanceId);
                        this.countDownTimer = '100';
                        this.openModal(this.launchMachineModal);
                        this.launchStarted = false;
                        this.testFinished = false;
                        this.testStarted = false;
                        this.candidate.LaunchedFromStoppedInstance = true;
                        this.startInstance(data[0].InstanceId);
                    } else {
                        console.log('no stopped instance found launch from ami');
                        this.countDownTimer = '300';
                        this.openModal(this.launchMachineModal);
                        this.launchStarted = false;
                        this.testFinished = false;
                        this.testStarted = false;
                        this.launchInstance();
                    }
                    // modal image changes
                    const element = document.getElementById('loadingWindow') as any;
                    setTimeout(() => {
                        element.src = '/assets/images/loadingconsole.gif';
                    }, 5000);
                    setTimeout(() => {
                        element.src = '/assets/images/loadingconsole.gif';
                    }, 17000);
                },
                error => {
                    const err = JSON.parse(error._body);
                    this.alertService.error(err.error.message);
                });
    }
    secondsToHms(d) {
        d = Number(d);
        let h = Math.floor(d / 3600);
        let m = Math.floor(d % 3600 / 60);
        let s = Math.floor(d % 3600 % 60);

        let hDisplay = h > 0 ? h + (h == 1 ? ' hr, ' : ' hrs, ') : '';
        let mDisplay = m > 0 ? m + (m == 1 ? ' min, ' : ' mins, ') : '';
        let sDisplay = s > 0 ? s + (s == 1 ? ' sec' : ' secs') : '';
        return hDisplay + mDisplay + sDisplay;
    }

    // dj
    loadTestDetails(testId) {
        console.log('loadtest datails');
        this.onlineTestService.getById(testId)
            .subscribe(
                data => {
                    // this.router.navigate([this.returnUrl]);
                    // this.alertService.success('The Online test has been saved.', true);
                    console.log(data);
                    //console.log(JSON.stringify(data));
                    //console.log('testdata->end');
                    this.onlineTest = data;
                    this.loading = false;
                    this.status = 'TEST_INITIAL';
                    this.webCameEnabled = data.enableWebCamRecording;
                    try {
                        this.mcqDuration = (this.onlineTest.mcqQuestions['config'].duration / 60);
                    } catch (err) {}
                    // get the environment details
                    this.totalTestDuration = this.onlineTest.duration * 60;

                    if (!this.onlineTest['hideMcqTest']) {
                        this.totalTestDuration += (this.mcqDuration * 60);
                    }

                    if (!this.onlineTest['hideVideoTest'] && this.onlineTest['videoTestDuration']) {
                        this.totalTestDuration += this.onlineTest['videoTestDuration'] * 60;
                    }

                    const languageOptions = require('../shared/static/language.json');
                    const category = languageOptions.find(item => item.value === this.onlineTest['category']);
                    if (category) {
                        this.technology = category.label;
                    }
                    this.environmentService.getById(data.envId)
                        .subscribe(
                            resp => {
                                this.environment = resp;
                                this.onlineTest.environment = resp.amiid;
                                //for basictest type get the container details from envId
                                if (this.onlineTest.taskId.length <= 0) {
                                    console.log('basic test');
                                    this.onlineTest.taskId = resp.taskId;
                                    this.onlineTest.containerName = resp.containerName;
                                    this.onlineTest.projectName = this.onlineTest.GitHubUrl.match(/[\s\S]+\/(.*)$/)[1];
                                }
                            },
                            error => {}
                        );
                },
                error => {
                    this.status = 'NOT_FOUND';
                    this.loading = true;
                    const err = JSON.parse(error._body);
                    this.alertService.error(err.error.message);
                    this.alertService.success('Test not found!', true);
                    this.router.navigate(['/login']);
                    // this.loading = false;
                }
            );
    }

    getTimeRemaining(endtime) {
        const t: number = Date.parse(endtime) - new Date().getTime();
        const seconds = Math.floor((t / 1000) % 60);
        const minutes = Math.floor((t / 1000 / 60) % 60);
        const hours = Math.floor((t / (1000 * 60 * 60)) % 24);
        const days = Math.floor(t / (1000 * 60 * 60 * 24));
        return {
            'total': t,
            'days': days,
            'hours': hours,
            'minutes': minutes,
            'seconds': seconds
        };
    }

    initializeClock(id, endtime) {
        this.clock = document.getElementById(id);
        this.hoursSpan = this.clock.querySelector('.hours');
        this.minutesSpan = this.clock.querySelector('.minutes');
        this.secondsSpan = this.clock.querySelector('.seconds');
        this.endtime = endtime;
        this.updateClock();
        this.timeinterval = setInterval(() => {
            this.updateClock();
        }, 1000);
    }

    updateClock() {
        const t = this.getTimeRemaining(this.endtime);

        this.hoursSpan.innerHTML = ('0' + t.hours).slice(-2);
        this.minutesSpan.innerHTML = ('0' + t.minutes).slice(-2);
        this.secondsSpan.innerHTML = ('0' + t.seconds).slice(-2);

        if (t.total <= 0) {
            // _finishTest();
            console.log('cleare..');
            clearInterval(this.timeinterval);
        }

        // hack added to set the iframe focused every sec
        try {
            document.getElementById('testWindow').focus();
        } catch (e) {
            console.log(e);
        }
    }

    viewTestDetails() {
        this.openModal(this.testDetailsModal);
    }

    viewQuestion() {
        const config = {
            animated: true,
            keyboard: false,
            backdrop: true,
            ignoreBackdropClick: false,
            size: 'lg',
            windowClass: 'modal-dialog-slideout'
          };
        this.openModal(this.testQuestionModal, config);
        setTimeout(function () {
            document.getElementById('testWindow').focus();
        }, 5000);
    }

    // webcam recording section
    _startRecording() {
        // set the initial state of the video
        console.log('in start recording');
        this.startClicked = true;
        setTimeout(() => {
            const video: HTMLVideoElement = this.video.nativeElement;
            video.muted = false;
            video.controls = true;
            video.autoplay = false;
            this.startRecording();
        }, 100);
    }
    toggleControls() {
        const video: HTMLVideoElement = this.video.nativeElement;
        const video2: HTMLVideoElement = this.video2.nativeElement;
        video.muted = !video.muted;
        video.controls = !video.controls;
        video.autoplay = !video.autoplay;

        video2.muted = !video2.muted;
        video2.controls = !video2.controls;
        video2.autoplay = !video2.autoplay;
    }

    successCallback(stream: MediaStream) {
        this.webCamPermissionAsked = true;

        const options = {
            mimeType: 'video/webm', // or video/webm\;codecs=h264 or video/webm\;codecs=vp9
            timeSlice: 1000,
            audioBitsPerSecond: 64000,
            videoBitsPerSecond: 64000,
            bitsPerSecond: 64000, // if this line is provided, skip above two
            ondataavailable: function (blob) {
                console.log('blob size' + (blob.size / 1000) + 'kb');
            }
        };
        this.stream = stream;
        this.recordRTC = RecordRTC(stream, options);
        this.recordRTC.startRecording();
        const video: HTMLVideoElement = this.video.nativeElement;
        const video2: HTMLVideoElement = this.video2.nativeElement;
        // video.src = window.URL.createObjectURL(stream);
        video.srcObject = stream;
        video2.srcObject = stream;
        this.webcamSuccess = true;
        this.webCamEnabled = true;
        this.toggleControls();
    }

    errorCallback(err) {
        // handle error here
        this.webCamPermissionAsked = true;
        console.log('ERRRR' + err.message);
        let msg = 'Theres an error initiating the video recording.';
        if (err.message.indexOf('Requested device not found') >= 0) {
            msg += 'Permission denided ';
        } else {
            msg += '\nPlease check if you have granted the necessary permissions to the browser.';
        }
        this.alertService.error(msg);
    }

    processVideo(audioVideoWebMURL) {
        const video: HTMLVideoElement = this.video.nativeElement;
        const recordRTC = this.recordRTC;
        console.log(audioVideoWebMURL);
        video.src = audioVideoWebMURL;
        video.style.visibility = 'hidden';
        this._videoURL = audioVideoWebMURL;
        this.toggleControls();
        recordRTC.getDataURL(function (dataURL) {
            console.log(dataURL);
        });
    }

    startRecording() {
        const mediaConstraints = {
            video: {
                mandatory: {
                    minWidth: 200,
                    minHeight: 150
                }
            },
            audio: true
        };
        navigator.mediaDevices
            .getUserMedia({
                video: true,
                audio: true
            })
            .then(this.successCallback.bind(this), this.errorCallback.bind(this));
    }

    stopRecording() {
        const recordRTC = this.recordRTC;
        recordRTC.stopRecording(this.processVideo.bind(this));
        const stream = this.stream;
        stream.getAudioTracks().forEach(track => track.stop());
        stream.getVideoTracks().forEach(track => track.stop());
    }

    finishRecording() {
        this.stopRecording();
        this._interviewRecState = 'STOPPED';
        this.alertService.success('Your video recording is stopped. Please click on the play button to preview your video.');
    }

    cancelRecording() {
        this._interviewRecState = 'CANCELLED';
        this.alertService.success('You have chosen to submit the interview at later day.' +
            ' Please note additional preference is given to candidates who have submitted the video interview.');
        this.stopRecording();
    }

    feed() {
        const video = document.getElementById('pipe-recorder');
        video.style.visibility = (video.style.visibility === 'visible') ? 'hidden' : 'visible';
    }
    feed2() {
        const video = document.getElementById('pipe-recorder');
        video.style.visibility = (video.style.visibility === 'visible') ? 'hidden' : 'visible';
    }
    _continue() {
        if (this.webCamEnabled == false) {
            const r = confirm('Do you want to continue without recording? \nPlease Note This Will Negatively Affect Your Chances of Being Hired .');
            if (r === true) {
                console.log('proceed to test without recording');
                this.startTest();
            }
        } else {
            this.startTest();
            this.startPipeRecording();
        }
    }

    //PIPE RECORDER
    getPermission() {
        const that = this;
        const pipeParams = {
            size: {
                width: 188,
                height: 140
            },
            qualityurl: 'avq/240p.xml',
            accountHash: '33bfa1cc15d433dd0102e8acd11b1559',
            eid: 1,
            showMenu: 0,
            mrt: 4220,
            sis: 1,
            asv: 1,
            mv: 1,
            dpv: 0,
            ao: 0,
            dup: 0
        };
        PipeSDK.insert('pipe-recorder', pipeParams, function (recorderInserted) {
            console.log('recorderInserted' + recorderInserted);
            that.recorderObject = recorderInserted;
            that.getRecorder();
            // var stopbtn = document.getElementById('stopbtn');

            //Calling Control API methods when the desktop event function onReadyToRecord() is triggered
            recorderInserted.onReadyToRecord = function (id, type) {
                var args = Array.prototype.slice.call(arguments);
                console.log('onReadyToRecord(' + args.join(', ') + ')');

                //enabling the record button
                //recbtn.disabled = false;        



                //stopbtn.onclick = function (){
                //calling the control API method
                //recorderInserted.stopVideo();

                //enabling the stop button, disabling the record button
                //stopbtn.disabled = true;
                //}


            }




            //DESKTOP EVENTS API
            recorderInserted.userHasCamMic = function (id, camNr, micNr) {
                var args = Array.prototype.slice.call(arguments);
                console.log('userHasCamMic(' + args.join(', ') + ')');
            }

            recorderInserted.btRecordPressed = function (id) {
                var args = Array.prototype.slice.call(arguments);
                console.log('btRecordPressed(' + args.join(', ') + ')');
            }

            recorderInserted.btStopRecordingPressed = function (id) {
                var args = Array.prototype.slice.call(arguments);
                console.log('btStopRecordingPressed(' + args.join(', ') + ')');
            }

            recorderInserted.btPlayPressed = function (id) {
                var args = Array.prototype.slice.call(arguments);
                console.log('btPlayPressed(' + args.join(', ') + ')');
            }

            recorderInserted.btPausePressed = function (id) {
                var args = Array.prototype.slice.call(arguments);
                console.log('btPausePressed(' + args.join(', ') + ')');
            }

            recorderInserted.onVideoUploadProgress = function (recorderId, percent) {
                var args = Array.prototype.slice.call(arguments);
                console.log('onVideoUploadProgress(' + args.join(', ') + ')');
                console.log('uploaded % = ' + percent);
                that.uploadPercentage = percent;
                that.changeDetectionRef.detectChanges();
            }
            recorderInserted.onUploadDone = function (recorderId, streamName, streamDuration, audioCodec, videoCodec, fileType, audioOnly, location) {
                var args = Array.prototype.slice.call(arguments);
                console.log('onUploadDone(' + args.join(', ') + ')');
                that.updateVideoUrl(streamName);
                recorderInserted.remove();

                //enabling record, play and save buttons


            }


            recorderInserted.onCamAccess = function (id, allowed) {
                var args = Array.prototype.slice.call(arguments);
                //document.getElementById('feed').style.visibility='visible';
                //document.getElementById('recordbtn').style.visibility='visible';
                //document.getElementById('pausebtn').style.visibility='visible';
                //setTimeout(()=>{


                if (allowed) {
                    that.webcamSuccess = true;
                    that.webCamEnabled = true;
                }
                that.webCamPermissionAsked = true;
                that.feed();
                that.changeDetectionRef.detectChanges();

                console.log('onCamAccess(' + allowed + ')');
                //});
            }

            recorderInserted.onPlaybackComplete = function (id) {
                var args = Array.prototype.slice.call(arguments);
                console.log('onPlaybackComplete(' + args.join(', ') + ')');

                //enabling play button, disabling pause button


            }

            recorderInserted.onRecordingStarted = function (id) {
                var args = Array.prototype.slice.call(arguments);
                console.log('onRecordingStarted(' + args.join(', ') + ')');
            }

            recorderInserted.onConnectionClosed = function (id) {
                var args = Array.prototype.slice.call(arguments);
                console.log('onConnectionClosed(' + args.join(', ') + ')');
            }

            recorderInserted.onConnectionStatus = function (id, status) {
                var args = Array.prototype.slice.call(arguments);
                console.log('onConnectionStatus222(' + args.join(', ') + ')');
                console.log(document.getElementById('pipeError-pipe-recorder').textContent);
                if (document.getElementById('pipeError-pipe-recorder').textContent == 'You need a webcam to record video') {
                    if (that.webCamPermissionAsked == false)
                        alert('No webcam detected. Please make sure you have connected the webcam and its working fine. If you dont have a webcam then just click continue to proceed without recording!');
                    that.webCamPermissionAsked = true;
                    that.changeDetectionRef.detectChanges();
                }
            }

            recorderInserted.onMicActivityLevel = function (id, level) {
                var args = Array.prototype.slice.call(arguments);
                //console.log('onMicActivityLevel('+args.join(', ')+')');
            }

            recorderInserted.onFPSChange = function (id, fps) {
                var args = Array.prototype.slice.call(arguments);
                //console.log('onFPSChange('+args.join(', ')+')');
            }

            recorderInserted.onSaveOk = function (recorderId, streamName, streamDuration, cameraName, micName, audioCodec, videoCodec, filetype, videoId, audioOnly, location) {
                var args = Array.prototype.slice.call(arguments);
                console.log('onSaveOk(' + args.join(', ') + ')');
            }

            //DESKTOP UPLOAD EVENTS API
            recorderInserted.onFlashReady = function (id) {
                var args = Array.prototype.slice.call(arguments);
                console.log('onFlashReady(' + args.join(', ') + ')');
            }

            recorderInserted.onDesktopVideoUploadStarted = function (recorderId, filename, filetype, audioOnly) {
                var args = Array.prototype.slice.call(arguments);
                console.log('onDesktopVideoUploadStarted(' + args.join(', ') + ')');
            }

            recorderInserted.onDesktopVideoUploadSuccess = function (recorderId, filename, filetype, videoId, audioOnly, location) {
                var args = Array.prototype.slice.call(arguments);
                console.log('onDesktopVideoUploadSuccess(' + args.join(', ') + ')');
                console.log('upload done proceeding to FINISH TEST');


            }

            recorderInserted.onDesktopVideoUploadFailed = function (id, error) {
                var args = Array.prototype.slice.call(arguments);
                console.log('onDesktopVideoUploadFailed(' + args.join(', ') + ')');
            }



        });
    }
    getRecorder() {
        console.log('getrecorder function called' + this.recorderObject);
    }
    updateVideoUrl(streamName) {
        console.log('in callFinishTest video id=' + streamName);
        console.log('stop interval');
        clearInterval(this.updateProgress);
        this.candidate.PipeVideoRecordingUrl = streamName;
        this.candidateService.update(this.candidate)
            .subscribe(
                data => {
                    console.log('Webcam Recording URL updated');
                    console.log(data);
                    this.candidate = data;
                    //call the socketmethod now
                    console.log('sending finish test event to machine');
                    const obj = {
                        ip: ''
                    };
                    obj.ip = this.publicIp;
                    this.notifyService.triggerFinishTest(obj);
                    console.log('triggerFinishTest event sent...');
                },
                error => {
                    const err = JSON.parse(error._body);
                    //dj:commented this.alertService.error(err.error.message);
                    this.loading = false;
                });




    }
    startPipeRecording() {
        console.log('starttig the recording');
        this.recorderObject.record();
    }

    stopPipeRecording() {
        console.log('stopping the video onFinishTest event');
        var that = this;
        this.updateProgress = setInterval(() => {
            that.updateProgress2();
            //this.changeDetectionRef.detectChanges();
        }, 500);
        console.log('setinterval called' + this.updateProgress);
        this.recorderObject.stopVideo();
    }

    //progrss
    updateProgress2() {
        console.log('update2');
        try {
            //console.log('INNER:'+document.getElementById('pipeMsgOverlay-pipe-recorder').innerHTML);
            document.getElementById('uploadstatus').innerHTML = document.getElementById('pipeMsgOverlay-pipe-recorder').innerHTML;

        } catch (e) {
            console.log(e);
        }
    }
    checkInterval() {
        this.updateProgress = setInterval(() => {
            this.updateProgress2();
            //this.changeDetectionRef.detectChanges();
        }, 500);
    }

    cancelInterval() {
        clearInterval(this.updateProgress);
        console.log('clearedd');
    }

    loadStackBlitzEditor() {
        console.log('loading stackblitz');
        return this.loadContainerIframe();
        let url = this.onlineTest.GitHubUrl.substring(this.onlineTest.GitHubUrl.indexOf('github.com/') + 11);
        sdk.embedGithubProject('myDiv', url, {
                height: screen.availHeight - 140
            })
            .then((dir) => {
                this.vm = dir;
                document.getElementById('myDiv').style.position = 'absolute';
                document.getElementById('myDiv').style.top = '42px';
                console.dir(this.vm);
                this.startCountDown();

            }).catch((e) => {
                console.log('E->' + e);
            })
    }

    //ECS task
    loadContainerIframe() {
		/*
		setTimeout(() => {
			this.status = "TEST_OPEN_WINDOW";
		},5000)
		return;
		*/
        console.log('in load container' + this.candidate.testToken + '|' + this.onlineTest.id + '|' + this.onlineTest.GitHubUrl);
 this.containerPath=  Array.from({length:10}, _ => this.c[Math.floor(Math.random()*this.c.length)]).join('');
    let timeStamp = new Date().getTime()+"";
	timeStamp =timeStamp.substring(-7,7);
   	this.containerPath+= timeStamp;
 
        const taskDetails = {
            taskId: this.onlineTest.taskId,
            testId: this.onlineTest.id,
            inviteId: this.candidate.testToken,
            containerName: this.onlineTest.containerName,
            gitUrl: this.onlineTest.GitHubUrl,
            projectName: this.onlineTest.projectName,
			containerPath: this.containerPath
        };

        this.awsService.startTask(taskDetails)
            .subscribe(
                data => {
						if(data.failures.length>0){
						  alert("Sorry Resource is not available to run your test.\n please try again later.");
						  return; 
						}
                    console.log(data);
                    console.log('task = ' + data.tasks[0].taskArn);
                    this.taskId = data.tasks[0].taskArn.substring(data.tasks[0].taskArn.indexOf('/') + 1);
                    //update candidate entry
                    this.candidate.taskId = this.taskId;
                    this.candidate.testStarted = true;
                    this.candidate.status = 'ongoing';
                    this.candidateService.update(this.candidate)
                        .subscribe(
                            data => {
                                console.log('candidate entry added');
                                this.candidate = data;
                            },
                            error => {
                                const err = JSON.parse(error._body);
                            });
                    //now call the observable
                    console.log('now wait and fetch the ip of task = ' + this.taskId);
					this.addContainerMapping(this.containerPath,this.taskId);					
                    this.monitorTask(this.taskId);
                    this.startTimer();
                },
                error => {
                    const err = JSON.parse(error._body);
                    this.alertService.error(err.error.message);
                },
                () => console.log('Task Started')
            );

    }
	
	 addContainerMapping(containerPath,taskId){
	this.candidateService.addContainerMapping(containerPath,taskId)
        .subscribe(
                data => {
					console.log("mapping done");
					},
			    error => {
					console.log("mapping err");
				});
	 
 }

    //counter

    startTimer() {
        console.log('tt');
        let that = this;
        this.countDownId2 = setInterval(() => {
            if (that.totalSecs >= 0) {
                that.computeAndShowTime2();
            } else {
                //that.onCountDownFinish.emit('complete');
                //that.reset();
                clearInterval(this.countDownId2);
                this.totalSecs--;
            }
        }, 1000);

    }

    computeAndShowTime2() {
        this.hour = Math.floor(this.totalSecs / (60 * 60));
        this.min = Math.floor((this.totalSecs / (60) % 60));
        this.sec = Math.floor(this.totalSecs % (60));

        this.totalSecs--;
    }

    //

    monitorTask(taskId) {
        const stopTimer$ = Observable.timer(1 * 60 * 1000);
        const timer: any = Observable.timer(50, 4000).takeUntil(stopTimer$);

        const subscription = timer.subscribe(data => {
            this.fetchTaskIp(subscription, taskId);
        });
    }

    monitorTaskService(serviceName) {
        const stopTimer$ = Observable.timer(1 * 60 * 1000);
        const timer: any = Observable.timer(50, 4000).takeUntil(stopTimer$);

        const subscription = timer.subscribe(data => {
            this.getServiceDetails(subscription, serviceName);
        });
    }

    //Service
    launchTaskService() {
        console.log('in launch service' + this.candidate.testToken + '|' + this.onlineTest.id + '|' + this.onlineTest.GitHubUrl);
        const taskServiceDetails = {
            name: this.candidate.testToken,
            taskId: this.onlineTest.taskId,
            inviteId: this.candidate.testToken,
            containerName: this.onlineTest.containerName,
            gitUrl: this.onlineTest.GitHubUrl,
            projectName: this.onlineTest.projectName
        };

        this.awsService.startTaskService(taskServiceDetails)
            .subscribe(
                data => {
                    console.log(data);
                    this.monitorTaskService(this.candidate.testToken);
                },
                error => {
                    const err = JSON.parse(error._body);
                    this.alertService.error(err.error.message);
                },
                () => console.log('Service Started')
            );

    }



    fetchTaskIp(subscription, taskId) {
        this.awsService.getTasksIp(taskId,this.ecsLaunchType)
            .subscribe(
                data => {
                    console.log('x' + data);
                    if (data.error) {
                        console.log('in getstatus error retry again');
                    }
                    console.log('fetchtaskip#' + JSON.stringify(data));

                    if (data.PublicIp.length > 1) {
                        console.log('found public ip' + data.PublicDnsName);
                        this.publicIp = data.PublicIp;
					    	
						if(data.editorPort){
							console.log("found mapping");
							this.editorPort = data.editorPort;
						}
						if(data.outPutPort){
						this.outPutPort = data.outPutPort;
						}
						
                        //Now add the nginx reverse proxy into skillstack server
						this.candidateService.addNginxProxyEntry(this.containerPath,this.publicIp,this.editorPort,this.outPutPort)
							.subscribe(
								data => {
									console.log("nginx mapping done");
								},
								error=>{
									console.log("err in mapping");
									
								}
							);	
                        subscription.unsubscribe();
                        // Update the machine details entry
                        // this.launchMachineEntry_V2();

                        this.loadEditor(this.publicIp);

                    }
                },
                error => {
                    const err = JSON.parse(error._body);
                    subscription.unsubscribe();
                    this.alertService.error(err.error.message);
                },
                () => console.log('Monitor Status Complete')
            );

    }


    getServiceDetails(subscription, serviceName) {
        console.log('in getServiceDetails');
        this.awsService.getTaskServiceInfo(serviceName)
            .subscribe(
                data => {
                    console.log(data);
                    if (data.taskArns.length > 0) {
                        console.log('found tasks insideservice' + data);
                        this.taskId = data.taskArns[0].substring(data.taskArns[0].indexOf('/') + 1);
                        console.log('taskID=' + this.taskId);
                        //now call the observable
                        console.log('stop service monitoring and Monitor the task');
                        subscription.unsubscribe();
                        this.monitorTask(this.taskId);

                    }
                },
                error => {
                    const err = JSON.parse(error._body);
                    this.alertService.error(err.error.message);
                    subscription.unsubscribe();
                },
                () => console.log('Got task details fron service')
            );

    }

    loadEditor(publicUrl) {
        document.getElementById('myDiv').style.position = 'absolute';
        document.getElementById('myDiv').style.top = '42px';
        console.log('open this url' + publicUrl);
        setTimeout(() => {
            console.log('Load the editor after 10 secs')
            //start countdown removed from here
            //this.startCountDown();

            //this.rdpLink = 'http://' + publicUrl + ':'+this.editorPort+'/#/home/project/' + this.onlineTest.projectName;
             this.rdpLink = 'http://34.226.213.112/'+this.containerPath+'/#/home/project/' + this.onlineTest.projectName;
            this.httpRequestCheckingInterval = setInterval(() => {
                this.checkHttpRequest200(publicUrl);
            }, 4000);

            //this.iframeCheckingInterval = setInterval(() => {
            //this.checkIframeLoaded(publicUrl); 
            //}, 2000);	 

        }, 4000);



    }

    proceedToVideoInterview() {
        if (!this.previewMode) {
            if (!this.onlineTest['hideVideoTest']) {
                this.router.navigate(['/video-interview/' + this._id]);
            } else {
                this.status = 'TEST_COMPLETED';
            }
        } else {
            if (!this.onlineTest['hideVideoTest']) {
                this.router.navigate(['/video-interview/' + this._previewTestId + '/' + this._previewTestId]);
            } else {
                this.status = 'TEST_PREVIEW_COMPLETED';
            }
        }
    }

    checkHttpRequest200(publicUrl) {
        this.awsService.getHttpStatusCode(publicUrl,this.editorPort)
            .subscribe(
                data => {
                    console.log(data);
                    if (data.status === '200') {
                        console.log('http status =200');

                        console.log('now call iframe monitor');
                        //now call the observable
                        console.log('stop https status and monitor iframe');
// <<<<<<< HEAD
                        // if (this.status === 'LOADING_STACKBLITZ') {
                        //     this.status = 'TEST_OPEN_WINDOW';
                        // }
                        // this.rdpLink = 'http://' + publicUrl + ':3000/#/home/project/' + this.onlineTest.projectName;
                        // clearInterval(this.httpRequestCheckingInterval);
                        // this.iframeCheckingInterval = setInterval(() => {
                        //     this.checkIframe();
                        // }, 400);

                        this.status = 'TEST_OPEN_WINDOW';
                        //this.rdpLink = 'http://' + publicUrl + ':'+this.editorPort+'/#/home/project/' + this.onlineTest.projectName;
						this.rdpLink = 'http://34.226.213.112/'+this.containerPath+'/#/home/project/' + this.onlineTest.projectName;
						clearInterval(this.httpRequestCheckingInterval);
                        //this.iframeCheckingInterval = setInterval(() => {
                           setTimeout(()=>{this.checkIframe();},400); 
                            //this.checkIframeLoaded(publicUrl); 
                        //}, 2000);

                    }
                },
                error => {
                    const err = JSON.parse(error._body);
                    this.alertService.error(err.error.message);
                    clearInterval(this.httpRequestCheckingInterval);
                },
                () => console.log('Got task details fron service')
            );


    }

    checkIframeLoaded(publicUrl) {
        // Get a handle to the iframe element
        var iframe = document.getElementById('testWindow') as HTMLIFrameElement;
        try {
            var iframeDoc = iframe.contentDocument || iframe.contentWindow.document;

            // Check if loading is complete
            if (iframeDoc.readyState == 'complete') {
                //iframe.contentWindow.alert('Hello');
                iframe.contentWindow.onload = function () {
                    //alert('I am loaded');
                };
                // The loading is complete, call the function we want executed once the iframe is loaded
                //afterLoading();
                clearInterval(this.iframeCheckingInterval);
            }
        } catch (e) {
            console.log('exception now it is laoded' + e);
            //this.rdpLink = 'http://' + publicUrl + ':'+this.editorPort+'/#/home/project/' + this.onlineTest.projectName;
           this.rdpLink = 'http://34.226.213.112/'+this.containerPath+'/#/home/project/' + this.onlineTest.projectName;
		   clearInterval(this.iframeCheckingInterval);
        }

    }

    yourLoadFunction() {
        //alert('loaded iframe...............');


    }

    checkIframe() {
        console.log("in check iframe");
        const myiframe = document.getElementById('testWindow') as any;
        const loadingIndicator = document.querySelector('.theia-mini-browser-load-indicator') as any;
		    setTimeout(() => {
                         loadingIndicator.style.display = 'none';
                    }, 7000);
        if (window.navigator.userAgent.search(/Firefox/)) {
            myiframe.onload = function () {
				console.log("myiframe.onload done");
                console.log('firefox...');
                loadingIndicator.style.display = 'none';
            };
        } else {
            myiframe.onreadystatechange = function () {
				console.log("myiframe.readyState"+myiframe.readyState);
                if (myiframe.readyState == 'complete') {
                    loadingIndicator.style.display = 'none';
                }
            }
        }

    }





}
