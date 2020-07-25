import { Component, Input, Output, EventEmitter, OnInit, Injector, ViewChild } from '@angular/core';
import {EnvironmentService, AlertService, AwsService, TempInstanceService} from '../../../shared/services';
import {Observable} from 'rxjs/Rx';
import { TempInstance, Environment } from '../../../../models';
import { NgbModal, ModalDismissReasons, NgbModalOptions, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'app-launch-machine-widget',
    templateUrl: './launchmachinewidget.component.html',
    styleUrls: ['./launchmachinewidget.component.scss']
})
export class LaunchMachineWidgetComponent implements OnInit  {
    @Input() amiId: string;
    @Input() environment: Environment;
    @Input() onlinetestId: number;
    @Input() autoLaunch = false;
    @Input() launchMode = 'CANDIDATE';
    @Output()
    onMachineLaunched = new EventEmitter();
    @Output() onMachineCancelled = new EventEmitter();

    @ViewChild('countdownModal') countdownModal: any;
    @ViewChild('rdpDetailsModal') rdpDetailsModal: any;

    public loading: boolean;
    private currentInstanceId: string;
    public tickerloading: boolean;
    public currentStatus: string;
    public statusText: string;
    public baseAmiDetails: string;
    public launchStarted: boolean;
    public machinePassword: string;
    public secondsRemaining: number;
    public showLoginDetails: boolean;
    private environmentService: EnvironmentService;
    private awsService: AwsService;
    private alertService: AlertService;
    private tempInstanceService: TempInstanceService;
    private modalService: NgbModal;
    public rdpLink: string;
	public instanceLaunchedFromBuffer: boolean;
	public countDownTimer: string;
    closeResult: string;
    private modalRef: NgbModalRef;
    private beforeLaunchTooltip = 'Launch a machine on which you can view the solutons submitted by all candidates';
    private duringLaunchTooltip = 'Your machine is booting. You will be able to access it when the timer runs to zero.';
    private afterLaunchTooltip = 'Machine Launched!" button should be "click here to view the machine in another tab.';
    alerts: Array<any> = [];

    constructor(injector: Injector) {
        setTimeout(() => this.environmentService = injector.get(EnvironmentService));
        setTimeout(() => this.awsService = injector.get(AwsService));
        setTimeout(() => this.alertService = injector.get(AlertService));
        setTimeout(() => this.tempInstanceService = injector.get(TempInstanceService));
        setTimeout(() => this.modalService = injector.get(NgbModal));
    }

    ngOnInit() {
        this.loading = true;
        this.launchStarted = false;
        this.currentStatus = 'NA';
        this.secondsRemaining = 180;
        this.instanceLaunchedFromBuffer = false;
        if (this.autoLaunch) {
            this.launchMachine();
        }
    }

    launchMachine () {
        if (this.launchMode === 'RECRUITER' ) {
            const r = confirm('Launch machine to view candidate solutions?');
            if (r === true) {
                setTimeout(() => this.checkMachineLaunched());
            } else {
                this.onMachineCancelled.emit({'autoLaunch': false});
            }
        } else {
            setTimeout(() => this.checkMachineLaunched());
        }
    }

    showWarningLaunchMachine () {
        this.alertService.success('Please wait while we boot and initialize your test environment.'
        + ' Your machine is booting .. Note: This process will take upto 5 minutes.');
    }

    checkMachineLaunched () {
        if (this.onlinetestId) {
            this.awsService.checkIfMachineLaunched(this.onlinetestId)
            .subscribe(
                data => {
                    console.log(data);
                    if (data.status === 'available') {
                        console.log(' available');
                        this.currentInstanceId = data.instanceId;
                        this.rdpLink = data.rdpLink;
                        //this.getPassword();
                        this.getPublicIp();
                        this.showLoginDetails = true;
                        this.launchStarted = false;
                        this.currentStatus = 'ok';
                    } else {
                       // this.launchInstance();
                        this.checkIfStoppedMachineAvailable();
                        //dj this.showWarningLaunchMachine();
                    }
                },
                error => {
                    const err = JSON.parse(error._body);
                    this.alertService.error(err.error.message);
                    this.loading = false;
                });
        }
    }

    getBaseAmiDetails() {
            this.environmentService.getBaseAmiDetails(this.amiId)
            .subscribe(
                data => {
                    console.log('environemnt');
                    console.log(data);
                    this.environment = data;
                    this.baseAmiDetails = data.name + ' (' + data.description + ')';
                },
                error => {
                    const err = JSON.parse(error._body);
                    this.alertService.error(err.error.message);
                    this.loading = false;
                });
    }

    launchInstance() {
        this.statusText = 'Checking....';
        const instanceToLaunch = this.amiId;

        this.awsService.launchInstance(instanceToLaunch)
        .subscribe(
            data => {
                console.log('launching instance');
                console.log(data);
                this.launchStarted = true;
                this.monitor();
                this.startCountDown();
                this.statusText = 'Launching...';
                this.currentInstanceId = data.instanceId;
                this.instanceLaunchedFromBuffer = false;
                this.saveTempInstance({instanceId: data.instanceId});
               // dj: commented here to fix public ip issue
			   // this.getPassword();
               // this.launchMachineEntry();

            },
            error => {
                const err = JSON.parse(error._body);
                this.alertService.error(err.error.message);
                this.loading = false;
            });

    }

    getPublicIp() {
        if (this.currentInstanceId) {
            this.environmentService.getPublicIP(this.currentInstanceId)
            .subscribe(
                data => {
                    this.onMachineLaunched.emit({
                        'publicIp': data.ip,
                        'rdpLink': this.rdpLink
                    });
                },
                error => {
                    const err = JSON.parse(error._body);
                    this.alertService.error(err.error.message);
                });
        }
    }

    monitor() {
        this.loading = true;
        const stopTimer$ = Observable.timer(1 * 60 * 1000);
        const timer: any = Observable.timer(50, 4000).takeUntil(stopTimer$);

        const subscription = timer.subscribe(data => {

            if (this.currentStatus === 'initializing') {
                console.log('UNSUBSCRIB');
				// dj:added here to fix public ip issue
                this.getPassword();
                subscription.unsubscribe();
                    this.statusText = 'Done';
            }
            this.checkMachineStatus(subscription);
        });
    }

    startCountDown() {
        const timer: any = Observable.timer(1, 1000);
        const subscription = timer.subscribe(data => {

            if ( this.secondsRemaining === 0) {
                console.log('UNSUBSCRIB');
                subscription.unsubscribe();
            }else {
                this.secondsRemaining--;
            }
        });
    }

    checkMachineStatus(subscription) {
        this.awsService.getInstanceStatus(this.currentInstanceId)
        .subscribe(
            data => {

                console.log('x' + data.state);
                if (data.error) {
                    data.state = 'Machine not available';
                    this.currentStatus = 'Remote machine not available';
                    this.showLoginDetails = true;
                    subscription.unsubscribe();
                }
                this.currentStatus = data.state;

                console.log('this.currentStatus' + this.currentStatus);
                if (data.state === 'initializing' || data.state === 'ok') {
                    this.loading = false;
                    this.statusText = 'Done';
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
        this.loading = true;
        this.awsService.getPassword(this.amiId)
        .subscribe(
            data => {
                console.log('get password = ' + data);
                this.machinePassword = data.pwd;
                this.loading = false;
                this.getRDPLink();
            },
            error => {const err = JSON.parse(error._body);
                        this.alertService.error(err.error.message);
            }
        );

    }

    public closeAlert(alert: any) {

        const index: number = this.alerts.indexOf(alert);
        this.alerts.splice(index, 1);
    }

    showRDPDetails(event) {
        if (event === 'complete') {
            this.showLoginDetails = true;
            this.launchStarted = false;
            this.getPublicIp();
            this.modalRef.close();
        }
    }

    saveTempInstance(tempInstance) {
        this.tempInstanceService.create(tempInstance)
        .subscribe(
            data => {
                console.log(data);
            },
            error => {
                const err = JSON.parse(error._body);
                this.alertService.error(err.error.message);
            }
        );
    }

    getRDPLink () {
        const inputs = {
            instanceId: this.currentInstanceId,
            pwd: this.machinePassword
        };
        this.awsService.getRdpLink(inputs)
        .subscribe(
            data => {
                console.log(data);
                this.rdpLink = data.link;
                // dj
                this.launchMachineEntry();
            },
            error => {
                const err = JSON.parse(error._body);
                this.alertService.error(err.error.message);
            }
        );
    }

    launchMachineEntry() {
            const input = {
            type: 'solution',
            inviteId: '',
            duration: 60,
            gitUrl: this.environment['git_url'],
            instanceId: this.currentInstanceId,
            fullname: '',
            email: '',
            testId: this.onlinetestId,
            rdpLink: this.rdpLink
        };

        this.awsService.addMachinEntry(input)
                .subscribe(
                    data => {
                            console.log(data);
                        },
                    error => {  const err = JSON.parse(error._body);
                            this.alertService.error(err.error.message);
                        },
            () => console.log('Registered Machine')
            );
    }
    openRDPDetails () {
        this.openModal(this.rdpDetailsModal, {});
    }

    openInitialLaunchMachineCountdown() {
        const ngbModalOptions: NgbModalOptions = {
            backdrop : 'static',
            keyboard : false,
        };
        this.openModal(this.countdownModal, ngbModalOptions);
    }

    openModal(content, options) {
        this.modalRef = this.modalService.open(content, options);
        this.modalRef.result.then((result) => {
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

	// dj
    checkIfStoppedMachineAvailable() {
        this.awsService.getAvailableStoppedMachines(this.onlinetestId)
        .subscribe(
            data => {
                console.log(data);
                if (data.length > 0) {
                    console.log('Got stopped instance now start that instance:' + data[0].InstanceId);
                    // this.secondsRemaining = 100;
                    this.countDownTimer = '100';
                    this.launchStarted = true;
                    this.startInstance(data[0].InstanceId);
                } else{
                    console.log('no stopped instance found launch from ami');
                    // this.secondsRemaining = 300;
                    this.countDownTimer = '300';
                    this.launchStarted = true;
                    this.launchInstance();
                }
                this.openInitialLaunchMachineCountdown();
				const element = document.getElementById('loadingWindow') as any;
				setTimeout(()=>{				 
				element.src="/assets/images/loadingconsole.gif";
				},5000)
				setTimeout(()=>{				
				element.src="/assets/images/loadingconsole.gif";
				},17000);
            },
            error => {
                const err = JSON.parse(error._body);
                this.alertService.error(err.error.message);
            });
    }

    startInstance(instaceId) {
        this.statusText = 'Checking....';
        this.awsService.startInstance(instaceId)
        .subscribe(
            data => {
                console.log('launching stopped instance');
                this.currentInstanceId = instaceId;
                this.instanceLaunchedFromBuffer = true;
                this.monitor();
                this.statusText = 'Launching...';
                this.startCountDown();
                this.saveTempInstance({instanceId: instaceId,instanceLaunchedFromBuffer: true});
                // now update environment
                },
            error => {
                const err = JSON.parse(error._body);
                this.alertService.error(err.error.message);
                this.loading = false;
            });

    }
}
