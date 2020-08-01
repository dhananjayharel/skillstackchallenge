import { Component, OnInit, OnDestroy, Input, Output, EventEmitter, ViewChild, OnChanges, SimpleChange, SimpleChanges } from '@angular/core';
import { Candidate, Environment, OnlineTest } from '../../../../../models';
import { CandidateService, EnvironmentService, AlertService, PushNotificationService ,AwsService } from './../../../../shared';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import {Observable} from 'rxjs/Rx';
@Component({
    selector: 'onlinetest-candidiates-view',
    templateUrl: './onlinetestcandidiate.component.html',
    styleUrls: ['./onlinetestcandidiate.component.scss']
})
export class OnlineTestCandidiateComponent implements OnInit, OnDestroy, OnChanges {
    public loading: boolean;
    public environment: Environment = null;
    public publicIp: string = null;
	public editorPort = 3000;
	public outPutPort = -999;
    public candidateAmiId: string = null;
    private currentCandidate: Candidate;
    public currentVideoId: string;
    public currentVideoTitle: string;
    private rdpLink: string;
    private rdpWindow: any;
    private closeResult: string;
    public _autoLaunchMachine = false;
    private candidateQueue: Candidate;
    public candidateStatus: any;
    public candidates: Candidate[];
    public youTubeScreenRecordingUrl: string;
    public youTubeScreenRecordingTitle: string;
    public candidatetimelinetitle: string;
    public candidatetimeline: string;
	public pipevideoUrl = "";
	private scoreError = false;
	private taskId = "";
	private currentCandidateToken = "";
	private iframeCheckingInterval = null;
    private httpRequestCheckingInterval = null;
	private c = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
	private ecsLaunchType = "EC2";
    public candidateStatusText = {
        'invited': 'Invited',
        'expired': 'Expired',
        'waiting_for_evaluation': 'Evaluation Awaited',
        'accepted': 'Accepted',
        'rejected': 'Rejected',
        'ongoing': 'Test In Progress'
    };
    @ViewChild('candidateTimelineModal') timelineModal: any;
    @ViewChild('vimeoPlayerModal') modal: any;
	@ViewChild('pipePlayerModal') pipePlayerModal: any;	
    @ViewChild('youtubePlayerModal') youtubeModal: any;
    @ViewChild('evaluateMarksModal') evaluateModal: any;
	@ViewChild('executeSolutionModal') execSolutionModal: any;
	@ViewChild('gitDiffModal') gitDiffModal: any;
	@ViewChild('testcaseSummary') testcaseSummary: any;
    @ViewChild('pipeVideo') pipeVideo;
    @ViewChild('mcqResultModal') mcqResultModal: any;
	@ViewChild('loadingContainerModal') loadingContainerModal: any;
    @Input() testOnline: OnlineTest;
    @Input()  actualCandidates: Candidate[];
    @Input() filter: String;
    @Output() onInitialized: EventEmitter<any> = new EventEmitter();
    @Output() onDestroyed: EventEmitter<any> = new EventEmitter();
    @Output() onResendInvite: EventEmitter<any> = new EventEmitter();

    constructor(private candidateService: CandidateService,
                private alertService: AlertService,
                private environmentService: EnvironmentService,
                private notifyService: PushNotificationService,
                private awsService: AwsService,
                private modalService: NgbModal) { }

    ngOnInit() {
        this.onInitialized.emit(true);

        // const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        // if (currentUser.userId) {
        //     const filter = { 'where': {'onlineTestId': this.testOnline.id, 'uid': currentUser.userId}};
        //     this.fetchCandidates(filter);
        // }
        
        for ( let i = 0; i < this.actualCandidates.length; i++) {
            this.actualCandidates[i]['isSolutionViewed'] = false;
            if (this.actualCandidates[i]['AmiId']) {
                this.candidateAmiId = this.actualCandidates[i]['AmiId'];
            }
            const currentTime = Math.floor(Date.now() / 1000);
            if (this.actualCandidates[i]['expectedEndTime'] > currentTime) {
                if (this.actualCandidates[i].status === 'waiting_for_evaluation') {
                    this.actualCandidates[i]['videoAwaited'] = true;
                }
            } else {
                if (this.actualCandidates[i].status === 'ongoing') {
                    this.actualCandidates[i].status = 'waiting_for_evaluation';
                }
            }
        }

        this.prepareCandidateStatus();

        if (this.testOnline['envId']) {
            const sessionData = this._getSession();
            if (sessionData) {
                this.publicIp = sessionData.publicIp;
                this.rdpLink = sessionData.rdpLink;
               // this.socketServerInit();
            }

            this._getEnvironmentDetails(this.testOnline['envId']);
        }

        this.filterPanel(this.filter);
    }

    socketServerInit () {
        this.notifyService.initializeConnection(this.publicIp);
        this.notifyService.onGitCheckoutStatusAck().subscribe(obj => {
            console.log(obj);
            this.alertService.success(obj.candidateName +
                '\'s code is successfully switched on RDP machine.');
            // if (this.candidateQueue) {
            //     this.gitCheckOut(this.candidateQueue);
            //     this.candidateQueue = null;
            // }
        });
    }

    onLaunchMachineCancel($event) {
        console.log($event);
        this._autoLaunchMachine = $event.autoLaunch;
    }

    ngOnDestroy() {
        this.onDestroyed.emit(true);
        this.notifyService.close();
    }

    ngOnChanges(change: SimpleChanges) {
        console.log(change);
        if (change['actualCandidates']) {
            this.actualCandidates = change['actualCandidates'].currentValue;
            this.prepareCandidateStatus();
        }

        if (change['filter']) {
            this.filter = change['filter'].currentValue;
        }

        this.filterPanel(this.filter);
    }

    closeCandidatePanel() {
        this.onDestroyed.emit(true);
    }

    fetchCandidates(filter = null) {

        this.loading = true;
        this.candidateService.getAll(filter)
        .subscribe(
                data => {
                    console.log(data);
                    for ( let i = 0; i < data.length; i++) {
                        data[i].isSolutionViewed = false;
                        if (data[i].AmiId) {
                            this.candidateAmiId = data[i].AmiId;
                        }
                    }
                    this.actualCandidates = data;
                    this.loading = false;
                    this.prepareCandidateStatus();
                    this.filterPanel(this.filter);
                },
                error => {
                    const err = JSON.parse(error._body);
                    this.alertService.error(err.error.message);
                    this.loading = false;
                });
    }

    prepareCandidateStatus() {
        console.log(this.actualCandidates);
        this.candidateStatus = {
            'invited': 0,
            'expired': 0,
            'waiting_for_evaluation': 0,
            'accepted': 0,
            'rejected': 0
        };

        for (let i = 0; i < this.actualCandidates.length; i++) {
            const status = this.actualCandidates[i]['status'];

            if (status === 'invited' || status === 'Invited') {
                this.candidateStatus['invited']++;
            } else if (status === 'expired' || status === 'Expired') {
                this.candidateStatus['expired']++;
            } else if (status === 'Waiting for evaluation' || status === 'waiting_for_evaluation' || status === 'completed') {
                this.candidateStatus['waiting_for_evaluation']++;
                this.actualCandidates[i]['status'] = 'waiting_for_evaluation';
            } else if (status === 'Accepted') {
                this.candidateStatus['accepted']++;
            } else if (status === 'Rejected') {
                this.candidateStatus['rejected']++;
            }
        }
        console.log(this.candidateStatus);
    }

    toggleActionBar (index,event) {
        const elem = document.getElementsByClassName('candidate-action-' + index);
        elem[0].classList.toggle('closed');
        event.stopPropagation();
        const elem1 = document.querySelector('.candidate-action-trigger-' + index + ' i');
        setTimeout(function () {
            elem1.classList.toggle('fa-angle-up');
        }, 500);
       // elem1.classList.toggle('fa-angle-down');
    }

    showCandidateTimeline(index) {
        const elem = document.getElementById('candidate-timeline-' + index);
        elem.classList.toggle('closed');
    }

    launchMachine(index) {
        this.candidates[index]['isSolutionViewed'] = true;
    }

    enableGitDiff($event) {
        console.log($event);
         if ($event.publicIp) {
             this.publicIp = $event.publicIp;
             this.rdpLink = $event.rdpLink;
             this._saveSession();
             this.socketServerInit();
			  const r = confirm('Machine is up and running and the code is successfully switched on RDP machine.\nopen the RDP link in new tab ?');

        if (r === true) {
			this.gitCheckOut(this.candidateQueue);
			this.rdpWindow = window.open(this.rdpLink, '_blank');
         }
    }
	}

    viewSolution (candidate: Candidate) {
        if(this.testOnline.isWebBasedTest){
		
		  console.log("this is webtype test launch the container"+candidate["testToken"]);
		  if(this.currentCandidateToken == candidate["testToken"]){
		    //container is already running open the new tab
				if (!this.rdpWindow || this.rdpWindow.closed) {
					console.log('open window');
					this.rdpWindow = window.open(this.rdpLink, '_blank');
				}
		  }
		  else{
		    this.rdpWindow = "";
			this.currentCandidateToken = candidate["testToken"];
			this.openModal(this.loadingContainerModal, {});
		    this.loadContainerIframe(candidate["testToken"]);
		  }
		}
		else{
		
			if (!this._autoLaunchMachine) {
				this._autoLaunchMachine = true;
				this.candidateQueue = candidate;
			} else {
				console.log('already booted123123123');
				//console.log("this.rdpWindow!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!"+this.rdpWindow);
				this.gitCheckOut(candidate);
				//console.log("this.rdpWindow!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!"+this.rdpWindow);
				if (!this.rdpWindow || this.rdpWindow.closed) {
					console.log('open window');
					this.rdpWindow = window.open(this.rdpLink, '_blank');
				}
			}
		}
    }
	
	viewTestcaseSummary(index){
         this.currentCandidate = this.candidates[index];
		 console.log("viewTestcaseSummary");
		 console.log(this.currentCandidate);
		this.openModal(this.testcaseSummary, {});
	
	}
	
	viewSolutionMobileView(candidate: Candidate){
		this.openModal(this.execSolutionModal, {}); 
    }
    
    viewMCQSolution(index) {
        if (this.candidates[index]['mcqQuestions'].pages) {

            // const questions = this.candidates[index]['mcqQuestions'].pages;
            // const selection = this.candidates[index]['mcqQuestionResponse']
            // console.log(selection)
            // console.log(questions)
            // const computedResult
            //     = questions.filter(question => question.elements[0].type !== 'html')
            //     .map(question => {
            //         let _question = {
            //             name: '',
            //             questionTypeId: 1,
            //             options: []
            //         };
            //         _question.name = question.elements[0].title;
            //         _question.options = question.elements[0].choices
            //             .map(option => {
            //                 let _option = {
            //                     name: '',
            //                     isAnswer: false,
            //                     selected: false
            //                 }
            //                 _option.name = option.text ? option.text : option;
            //                 _option.isAnswer = (question.elements[0].correctAnswer === option);
            //                 const selectedValue =  option.value ? option.value : option;
            //                 _option.selected = selection[question.elements[0].name] === selectedValue;
            //                 return _option;
            //             });
            //         return _question;
            //     });
            // console.log(computedResult)
            // this.candidates[index]['computedMcqResult'] = JSON.stringify(computedResult) ;
        }
        this.currentCandidate = this.candidates[index];
		this.openModal(this.mcqResultModal, { 'size': 'lg'});
	}
	
	gitDiffMobileView(){
		this.openModal(this.gitDiffModal, {}); 
	}


    gitCheckOut(candidate: Candidate) {
        if (this.publicIp != null) {
            this.notifyService.invokeGitCheckout({
                'publicIp': this.publicIp,
                'branchName': candidate['testToken'],
                'candidateName': candidate['fullname'],
                'result': candidate['score'],
                'testId': this.testOnline.id,
				'testName': this.testOnline.name
            }); 
			console.log("git checkout sent: test="+this.testOnline.name)
            console.log(candidate['testToken']);
        }
    }

    resend(candidate) {
        const r = confirm('Resend invite to ' + candidate.fullname + '?');

        if (r === true) {
            // this.onResendInvite.emit(candidate);
            this.candidateService.reSendInvite(candidate.id)
            .subscribe(
                    data => {
                        this.alertService.success('Candidate has been re-invited again.');
                        console.log(data);
                    },
                    error => {
                        const err = JSON.parse(error._body);
                        this.alertService.error(err.error.message);
                        this.loading = false;
                    }
            );
        }
    }

    calculateDiff(started: string,finished:string){
        let d2 = new Date(started).getTime();
        let d1 = new Date(finished).getTime(); //time in milliseconds
        var timeDiff = d1 - d2;
        var diff = timeDiff / (1000 * 60);
        return Math.floor(diff);
    }

    private _getEnvironmentDetails (envid) {
        this.environmentService.getById(envid)
            .subscribe(
                data => {
                    console.log('got environment details..');
                    console.log(data);
                    this.environment = data;
                    this.environment.git_url = 'https://github.com/vilashProgrammr/' + this.testOnline.id;
                    	//bypass set emiid 
						console.log("set");
					if(this.testOnline.isBasic==true){
						console.log("basic test");
						this.testOnline.taskId = data.taskId;
						this.testOnline.containerName = data.containerName;
						this.testOnline.projectName = this.testOnline.GitHubUrl.match(/[\s\S]+\/(.*)$/)[1];							
							}	
		            this.candidateAmiId = this.environment.amiid;
                },
                error => {
                    const err = JSON.parse(error._body);
                    this.alertService.error(err.error.message);
                    this.loading = false;
                });
    }

    playVideo(videoId, fullname) {
        this.currentVideoId = videoId;
        this.currentVideoTitle = fullname + '\'s Video';
        this.openModal(this.modal, { 'size': 'lg'});
    }
    playPipeVideo(videoId, fullname) {
        this.currentVideoId = videoId;
		
        this.currentVideoTitle = fullname + '\'s WebCam Recording Video';
        this.openModal(this.pipePlayerModal, { 'size': 'lg'});
		//const video: HTMLVideoElement =  this.pipeVideo.nativeElement;
		//video.src = "https://eu1-addpipe.s3.eu-central-1.amazonaws.com/69a72054090bb8f1a0c614e4e02e00cd/"+videoId+".mp4";
		this.pipevideoUrl = "https://eu1-addpipe.s3.eu-central-1.amazonaws.com/69a72054090bb8f1a0c614e4e02e00cd/"+videoId+".mp4";
	  // video.muted = false;
      //  video.controls = true;
      //  video.autoplay = true;
		//video.play();
    }
		
	

    openEvaluateModal (index) {
        this.currentCandidate = this.candidates[index];
        this.openModal(this.evaluateModal, {});
    }

    showCandidateTimelineModal (name, timeline) {
        this.candidatetimelinetitle = name + '\'s Timeline';
        this.candidatetimeline = timeline;
        this.openModal(this.timelineModal, { 'size': 'lg'});

    }

    evaluateCurrentCandidateMarks(score) {
        
		if(score.value <0 || score.value>100){
			this.scoreError=true;
			console.log("set error");
			return false;
		}
		this.currentCandidate['score'] = score.value;
        const ts = new Date();
        if (!this.currentCandidate['timeline']) {
            this.currentCandidate['timeline'] = [];
        }
        this.currentCandidate['timeline'].push({event: 'Evaluated', date: ts.toISOString()});
        this.candidateService.update(this.currentCandidate)
        .subscribe(
            (data) => {
                this.alertService.success(this.currentCandidate['fullname'] + '\'s score updated successfully.');
                const element = document.getElementById('evaluateModalCloseBtn') as any;

                element.click();
            }
        );
    }

    openModal(content, options) {
        this.modalService.open(content, options).result.then((result) => {
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

    updateCandidateStatus(_candidate, status) {
		const r = confirm('Mark ' +_candidate.fullname+' as '+ status + '?');
		if (r === true) {	
			_candidate.status = status;
			const ts = new Date();
			if (!_candidate.timeline) {
				_candidate.timeline = [];
			}
			_candidate.timeline.push({event: status, date: ts.toISOString()});

			this.candidateService.update(_candidate)
			.subscribe(
				(data) => {
					this.alertService.success(_candidate.fullname + ' is ' + status + ' successfully.');
					const currentUser = JSON.parse(localStorage.getItem('currentUser'));
					if (currentUser.userId) {
						const filter = { 'where': {'onlineTestId': this.testOnline.id}};
						this.fetchCandidates(filter);
					}
				}
			)
		}
    }

    _saveSession () {
        const writeObj = {'publicIp': this.publicIp, 'rdpLink': this.rdpLink};
        window.sessionStorage.setItem('test-' + this.testOnline.id, JSON.stringify(writeObj));
    }
	openSolution(tmpdir){
		console.log("open solution code"+tmpdir);
		   window.open("https://www.skillstack.com/embedchallenges2/?courseid=java21ssh&examplepath=echotest&challenge=" + this.testOnline.id + "&viewsolution="+tmpdir+"&loggedin=false", '_blank');
	}

    _getSession () {
        const macSession = window.sessionStorage.getItem('test-' + this.testOnline.id);
        if (macSession) {
            return JSON.parse(macSession);
        } else {
            return null;
        }
    }

    filterPanel (key) {
        this.filter = key;
        if (key !== 'all') {
            this.candidates = [];

            for (const _candidate of this.actualCandidates) {
                if (_candidate.status.toLowerCase() === key.toLowerCase()) {
                    this.candidates.push(_candidate);
                }
            }
        } else {
            this.candidates = this.actualCandidates;
        }
    }

    playYouTubeVideo(name, url) {
        this.youTubeScreenRecordingTitle = name + ' Screen Recording Video';
        this.youTubeScreenRecordingUrl = "https://www.youtube.com/embed/" + url + '?autoplay=1';
        console.log(name + ' ' + url);
        this.openModal(this.youtubeModal, { 'size': 'lg'});
    }
	
	//loading the container for web type tests
	//ECS task
loadContainerIframe(inviteId){
 console.log("in load container"+inviteId+"|"+this.testOnline.id+"|"+this.testOnline.GitHubUrl);
 const containerPath=  Array.from({length:20}, _ => this.c[Math.floor(Math.random()*this.c.length)]).join('');
 const taskDetails = {
            taskId: this.testOnline.taskId,
            testId: this.testOnline.id,
            inviteId: inviteId,
            containerName: this.testOnline.containerName,
           gitUrl: this.testOnline.GitHubUrl,
		   type: "web",
		   projectName:this.testOnline.projectName,
		   containerPath: containerPath
      };
	  
        this.awsService.startTask(taskDetails)
            .subscribe(
                data => {
                        console.log(data);
						console.log("task = "+data.tasks[0].taskArn);
						this.taskId = data.tasks[0].taskArn.substring(data.tasks[0].taskArn.indexOf("/")+1);
						
						//now call the observable
						console.log("now wait and fetch the ip of task = "+this.taskId);
						//update task id by mapping containerpath with taskid(neede in ec2 cluster)
						this.addContainerMapping(containerPath,this.taskId);
						
						this.monitorTask(this.taskId);
                    },
                error => {  const err = JSON.parse(error._body);
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

  monitorTask(taskId){
        const stopTimer$ = Observable.timer(1 * 60 * 1000);
        const timer: any = Observable.timer(50, 4000).takeUntil(stopTimer$);

        const subscription = timer.subscribe(data => {
            this.fetchTaskIp(subscription,taskId);
        }); 
  }
 
      fetchTaskIp(subscription,taskId) {
        this.awsService.getTasksIp(taskId,this.ecsLaunchType)
        .subscribe(
            data => {
                console.log('x' + data);
                if (data.error) {
                    console.log('in getstatus error retry again');                                     
                }
                    console.log('fetchtaskip#' + JSON.stringify(data));

                    if (data.PublicIp.length>1) {
                         console.log("found public ip"+data.PublicDnsName);		
						this.publicIp = data.PublicIp;
						if(data.editorPort){
							console.log("found mapping");
							this.editorPort = data.editorPort;
						}
						 subscription.unsubscribe();
				         //Update the machine details entry
                         //this.launchMachineEntry_V2();						 
						
						 this.loadEditor(this.publicIp);
						 
                    }
                },
        error => {    const err = JSON.parse(error._body);
                    subscription.unsubscribe();
                    this.alertService.error(err.error.message); 
                },
      () => console.log('Monitor Status Complete')
    );

  }
  
    loadEditor(publicUrl){
    //document.getElementById('myDiv').style.position = 'absolute';
	//document.getElementById('myDiv').style.top = "42px";
	console.log("open this url"+publicUrl);	
    setTimeout(() => {
	    console.log("Load the editor after 10 secs")
		this.rdpLink = 	'http://'+publicUrl + ':'+this.editorPort+'/#/home/project/'+this.testOnline.projectName;		
		this.httpRequestCheckingInterval = setInterval(() => {
		this.checkHttpRequest200(publicUrl); 
     }, 4000);				 		
    }, 4000);
	  
  }  
  
     checkHttpRequest200(publicUrl){
	   console.log("in checkHttpRequest200");
	    	this.awsService.getHttpStatusCode(publicUrl,this.editorPort)
						.subscribe(
							data => {
							         console.log(data);
							        if (data.status=="200"){
										console.log("http status =200");		
										console.log("stop https status and monitor iframe");
										this.rdpLink = 	'http://'+publicUrl + ':'+this.editorPort+'/#/home/project/'+this.testOnline.projectName;
										clearInterval(this.httpRequestCheckingInterval);
										const r = confirm('Machine is up and running and the code is successfully switched on RDP machine.\nopen the RDP link in new tab ?');

										if (r === true) {
											this.rdpWindow = window.open(this.rdpLink, '_blank');
										}
									}
								    },
							error => {  const err = JSON.parse(error._body);
										this.alertService.error(err.error.message);
										 clearInterval(this.httpRequestCheckingInterval);
									},
							() => console.log('Got task details fron service')
						); 
	   
	   
   }
   
}
