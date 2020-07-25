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
    AlertService,
    CandidateService,
    OnlineTestService
} from '../shared/services/index';
import {
    Candidate,
    OnlineTest
} from '../../models';
import {
    NgbModal,
    NgbModalOptions,
    ModalDismissReasons
} from '@ng-bootstrap/ng-bootstrap';

const RecordRTC = require('recordrtc/RecordRTC.min');
const Vimeo = require('vimeo').Vimeo;



@Component({
    selector: 'app-selfie-video',
    templateUrl: './selfie-video.component.html',
    styleUrls: ['selfie-video.component.scss']
})
export class SelfieVideoComponent implements OnInit {
    private isPreviewMode = false;
    private stream: MediaStream;
    private recordRTC: any;
    private _inviteId: string;
    private candidate: any;
    private onlineTest: OnlineTest;
    public _interviewRecState: string;
    public currentQuestionIndex: number;
    private vimeoClient: any;
    public videoUploadStatus: string;
    public questions: string[];
    private closeResult: string;
    private modalReference: any;
    private isPreviewTest: boolean;
    private testId: any;
    public mcqDuration = 0;
    public duration = 600; // defaults to 10 minutes
    public visitedEarlier = false;
    public timer: any = null;
    public startTime: Date;
    public endTime: Date;
    public ellapsedTime = '00:00';
    private startClicked = false;
    public showVideo = true;
    @ViewChild('otherAltSourceMedium') otherAltSourceMedium: any;

    public shareform = {
        type: 'email',
        email: '',
        selCountry: '91',
        mobile: '',
        fullname: '',
        testName: ''
    };
    public countries = [{
        key: 'IN',
        value: 91
    }, {
        key: 'US',
        value: 1
    }];

    @ViewChild('video') video;
    @ViewChild('previewVideo') previewVideo;

    constructor(private route: ActivatedRoute,
        private router: Router,
        private candidateService: CandidateService,
        private alertService: AlertService,
        private onlineTestService: OnlineTestService,
        private modalService: NgbModal) {
        // Do stuff
        let currentUrl = window.location.href;
        if (currentUrl.startsWith('http:')) {
            currentUrl = currentUrl.replace('http:', 'https:');
            window.location.href = currentUrl;
        }

        // this.route.queryParams.subscribe(params => {
        //     this.isPreviewMode = params['preview'];
        //     console.log(date); // Print the parameter to the console.
        // });
    }

    ngOnInit() {
        this._interviewRecState = 'LOADING';
        this._inviteId = this.route.snapshot.params['id'];
        if (this.route.snapshot.paramMap.has("testid")) {
            this.isPreviewTest = true;
            this.testId = this.route.snapshot.params['testid'];
            this.fetchOnlineQuestions(this.testId);
            let currentUserData = JSON.parse(localStorage.getItem('currentUserData'));
            this.shareform.email = currentUserData.email;
            this.candidate = [];
            this.candidate.fullname = currentUserData.fullname;
            this.shareform.fullname = currentUserData.fullname;

        } else {
            const filter = {
                'where': {
                    'testToken': this._inviteId
                }
            };
            this.fetchCandidate(filter);
        }
        this.vimeoClient = new Vimeo('40001c1b43a189f352954e896265e2f068bf54fc',
            'zgSAd4n8qNb+ODpKWPq/FU/1XEnUnUsnSK8Pn2+qiIyFEKf7+tMIMp2foDd/YQ5dU15l9Bpy8SGDXBiY3nWzZRSb+t0JdH2SNdWX8w+9lMBxnqTgrX1nCIReC4IHwC2z',
            '7626eb6d8f8abe2b4efee1b8b8b7c8a9');
    }

    fetchCandidate(filter) {
        this.candidateService.getAll(filter)
            .subscribe(
                data => {
                    console.log(data);
                    if (data.length > 0) {
                        // if (!data[0].videoUrl) {
                        this.candidate = data[0];
                        this.visitedEarlier = this.candidate.visitedVideoInterviewEarlier ? true : false;
                        this.fetchOnlineQuestions(this.candidate.onlineTestId);
                        this.shareform.email = this.candidate.email;
                        this.shareform.fullname = this.candidate.fullname;
                        this.updateVisitStatusforCandidate();
                        // } else {
                        //     this.router.navigate(['/login']);
                        //     this.alertService.error('This link has expired.');
                        // }
                    }
                }
            );
    }

    fetchOnlineQuestions(testId) {
        this.onlineTestService.getById(testId)
            .subscribe(
                data => {
                    console.log(data);
                    if (data.videoInterviewQuestions) {
                        this.onlineTest = data;
                        this.questions = this.onlineTest.videoInterviewQuestions;
                        this.shareform.testName = this.onlineTest.name;
                        this._interviewRecState = 'INITIAL';
                        this.currentQuestionIndex = 0;
                        try {
                            this.mcqDuration = (this.onlineTest.mcqQuestions['config'].duration / 60);
                        } catch (err) {}
                        // get the environment details

                    } else {
                        this.router.navigate(['/login']);
                        this.alertService.error('No interview questions have been configured.');
                    }
                }
            );
    }

    tick() {
        const now = new Date();
        const diff = ((this.startTime.getTime() + (this.duration * 1000)) - now.getTime()) / 1000;
        if (diff <= 0) {
            this.finishRecording();
        }
        this.ellapsedTime = this.parseTime(diff);
    }

    parseTime(totalSeconds: number) {
        let mins: string | number = Math.floor(totalSeconds / 60);
        let secs: string | number = Math.round(totalSeconds % 60);
        mins = (mins < 10 ? '0' : '') + mins;
        secs = (secs < 10 ? '0' : '') + secs;
        return `<div class="d-inline-block"><img src="/assets/images/timer.png"></div>
                <div class="d-inline-block"><span class="hours">${mins}</span></div>
                <div class="d-inline-block"><div class="smalltext">m</div></div>						
                <div class="d-inline-block"><span class="seconds">${secs}</span></div>
                <div class="d-inline-block"><div class="smalltext">s</div></div>`;
    }

    openAlternateSourceModal() {
        const r = confirm('Sure?');
        if (r) {
            this.openModal(this.otherAltSourceMedium);
        }
    }

    openModal(content) {
        const ngbModalOptions: NgbModalOptions = {
            // size: 'lg'
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
            return `with: ${reason}`;
        }
    }

    nextQuestion() {
        if (this.currentQuestionIndex !== this.questions.length) {
            this.currentQuestionIndex++;
        }
    }

    prevQuestion() {
        if (this.currentQuestionIndex !== 0) {
            this.currentQuestionIndex--;
        }
    }

    setCurrentQuestion(index) {
        this.currentQuestionIndex = index;
    }

    _startVideoRecording() {
        const r = confirm('Sure?');
        if (r) {
          navigator.mediaDevices.getUserMedia({video: true, audio: true}).then( res => {
            this._interviewRecState = 'BEFORESTART';
            this._startRecording();
            this.startTime = new Date();
            this.timer = setInterval(() => {
                this.tick();
            }, 1000);
          })
          .catch(err => {
            const msg = 'Theres an error initiating the video recording.' +
            ' Please check if you have granted the necessary permissions to the browser.';
            this.alertService.error(msg);
          });
        }
    }

    _startRecording() {
        // set the initial state of the video
        console.log("in start recording");
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
        video.muted = !video.muted;
        video.controls = !video.controls;
        video.autoplay = !video.autoplay;
    }

    successCallback(stream: MediaStream) {

        const options = {
            mimeType: 'video/webm', // or video/webm\;codecs=h264 or video/webm\;codecs=vp9
            audioBitsPerSecond: 640000,
            videoBitsPerSecond: 640000,
            bitsPerSecond: 640000 // if this line is provided, skip above two
        };
        this.stream = stream;
        this.recordRTC = RecordRTC(stream, options);
        this.recordRTC.startRecording();
        const video: HTMLVideoElement = this.video.nativeElement;
        // video.srcObject = stream
        // video.src = window.URL.createObjectURL(stream);
        video.srcObject = stream;
        this.toggleControls();
        this._interviewRecState = 'STARTED';
    }

    errorCallback() {
        // handle error here
        const msg = 'Theres an error initiating the video recording.' +
            ' Please check if you have granted the necessary permissions to the browser.';
        this.alertService.error(msg);
        this._interviewRecState = 'INITIAL';

    }

    processVideo(audioVideoWebMURL) {
        this.showVideo = false
        const previewVideo: HTMLVideoElement = this.previewVideo.nativeElement;
        const recordRTC = this.recordRTC;
        // video.style.visibility = 'hidden';
        this.toggleControls();
        previewVideo.src = audioVideoWebMURL;
        previewVideo.controls = true;
        previewVideo.autoplay = true;
        previewVideo.load();
        previewVideo.pause();
        this.uploadVideo();
        recordRTC.getDataURL(function (dataURL) {});
    }

    startRecording() {
        const mediaConstraints = {
            video: {
                mandatory: {
                    minWidth: 1280,
                    minHeight: 720
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
        const r = confirm('This will end your video recording. Are you sure?');
        if (r) {
            this.stopRecording();
            this._interviewRecState = 'STOPPED';
            // this.alertService.success('Your video recording is stopped. Please click on the play button to preview your video.');
        }
    }

    cancelRecording() {
        this._interviewRecState = 'CANCELLED';
        this.alertService.success('You have chosen to submit the interview at later day.' +
            ' Please note additional preference is given to candidates who have submitted the video interview.');
        this.stopRecording();
    }

    submit() {
        const elem = < HTMLInputElement > document.getElementById('submit-video');
        elem.disabled = true;
        // this.uploadVideo();

    }

    updateVisitStatusforCandidate() {
        const filter = {
            'where': {
                'testToken': this._inviteId
            }
        };
        this.candidateService.getAll(filter)
            .subscribe(
                data => {
                    if (data[0]) {
                        data[0].visitedVideoInterviewEarlier = true;

                        this.candidateService.update(data[0])
                            .subscribe(
                                resp => {
                                    console.log(resp);
                                },
                                error => {
                                    const err = JSON.parse(error._body);
                                });
                    }
                }
            );
    }

    updateCandidate() {
        const filter = {
            'where': {
                'testToken': this._inviteId
            }
        };
        this.candidateService.getAll(filter)
            .subscribe(
                data => {
                    if (data[0]) {
                        data[0].videoUrl = this.candidate.videoUrl;

                        this.candidateService.update(data[0])
                            .subscribe(
                                resp => {
                                    console.log(resp);
                                    this._interviewRecState = 'SUBMITTED';
                                    this.alertService.success('Your profile is submitted successfully. You may now close the tab.');
                                },
                                error => {
                                    const err = JSON.parse(error._body);
                                    this.alertService.error(err.error.message);
                                });
                    }
                }
            );
    }

    uploadVideo() {
        const that = this;
        this._interviewRecState = 'SUBMITTING';
        this.videoUploadStatus = '0.0';
        console.log(this.recordRTC.getBlob());
        if (this.isPreviewTest) {
            this._interviewRecState = 'PREVIEW_COMPLETE';
        } else {
            this.vimeoClient.upload(
                this.recordRTC.getBlob(),
                function (uri) {
                    console.log('File upload completed. Your Vimeo URI is:', uri);
                    that.videoUploadStatus = null;
                    that.candidate.videoUrl = uri;
                    if (that.isPreviewTest) {
                        that._interviewRecState = 'SUBMITTED';
                        that.alertService.success('Your profile is submitted successfully. You may now close the tab.');
                    } else {
                        that.updateCandidate();
                    }
                },
                function (bytesUploaded, bytesTotal) {
                    const percentage = (bytesUploaded / bytesTotal * 100).toFixed(2);
                    console.log(bytesUploaded, bytesTotal, percentage + '%');
                    that.videoUploadStatus = percentage;
                },
                function (error) {
                    that.videoUploadStatus = null;
                    console.log('Failed because: ' + error)
                    this.alertService.error('Error uploading the video.');
                }
            );
        }
    }

    successVideoUpload(obj) {
        console.log(obj);
    }

    errorVideoUpload(obj) {
        console.log(obj);
    }


    onShareVideoUrlSubmit() {
        console.log(this.shareform);
        if (this.isPreviewTest)
            this.shareform['shareUrl'] = 'https://www.skillstack.com/app/video-interview/' + this.testId + '/' + this.testId;
        else
            this.shareform['shareUrl'] = 'https://www.skillstack.com/app/video-interview/' + this._inviteId;

        this.candidateService.shareVideoUrl(this.shareform)
            .subscribe(
                resp => {
                    console.log(resp);
                    this.alertService.success('Your invite has been emailed to you successfully.');
                    if (this.shareform['email']) {
                        this._interviewRecState = 'MAILSENT';
                    } else {
                        this._interviewRecState = 'SMSSENT';
                    }
                    this.modalReference.close();
                },
                error => {
                    const err = JSON.parse(error._body);
                    this.alertService.error(err.error.message);
                });
    }
}
