import { Component, OnInit, ViewChild,ChangeDetectorRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { AlertService, AuthenticationService, UserService, CandidateService } from '../../shared/services/index';
import {Observable} from 'rxjs/Rx';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
declare var PipeSDK: any;
@Component({
    selector: 'app-profile',
    templateUrl: './admin.component.html',
    styleUrls: ['./admin.component.scss']
})

export class AdminComponent implements OnInit {
    public editUserForm: FormGroup;
    public loading = false;
    public submitted: boolean;
    public events: any[] = [];
    public returnUrl: string;
    public editUser: any;
    private modalReference: any;
    private closeResult: string;
	public machines: any;
	private allMachines: any;
	private recorder: any;
	public videoUrl = "";
	public updateProgress = null;
	private counter = 0;
	today: number = Date.now();
    @ViewChild('updatePasswordModal') psswdModal: any;
	@ViewChild('video') video;

    constructor(private route: ActivatedRoute,
                private router: Router,
                private _fb: FormBuilder,
                private modalService: NgbModal,
                private userService: UserService,
                private alertService: AlertService,
				private candidateService: CandidateService,
				private changeDetectionRef: ChangeDetectorRef
				) { }

    ngOnInit() {
            this.machines = [];
			this.allMachines = [];
        this.editUserForm = this._fb.group({
            email: [null, Validators.compose([Validators.required, Validators.minLength(1)])],
        //    password: [null, Validators.compose([Validators.required, Validators.minLength(4), Validators.maxLength(10)])],
        //    confirmPassword: [null, Validators.compose([Validators.required, Validators.minLength(4), Validators.maxLength(10)])],
            fullname: [null, Validators.compose([Validators.required, Validators.minLength(1), Validators.maxLength(20)])],
            companyname: [null, Validators.compose([Validators.required, Validators.minLength(1), Validators.maxLength(20)])],
            designation: [null, Validators.compose([Validators.required, Validators.minLength(1), Validators.maxLength(20)])],
            contactno: [null, Validators.compose([Validators.required, Validators.minLength(1), Validators.maxLength(10)])],
            location: [null, Validators.compose([Validators.required, Validators.minLength(1), Validators.maxLength(20)])],
            id: [],
        });

        // subscribe to form changes  
        this.subcribeToFormChanges();

        this.returnUrl = '/dashboard'; 

        let currentUserData = JSON.parse(localStorage.getItem('currentUserData'));
        this.editUser = JSON.parse(localStorage.getItem('currentUserData'));

        if(currentUserData){
           (<FormControl>this.editUserForm.controls['email'])
           .setValue(currentUserData.email, { onlySelf: true });
           (<FormControl>this.editUserForm.controls['fullname'])
           .setValue(currentUserData.fullname, { onlySelf: true });
           (<FormControl>this.editUserForm.controls['id'])
           .setValue(currentUserData.id, { onlySelf: true });
        }
		
		this.candidateService.getCandidatesCurrentRunningMachines().subscribe(
            data => {
				this.machines = data;
				console.log(data);
			},
            error=>						
			{});
			
		this.candidateService.getAllRunningMachines().subscribe(
            data => {
				this.allMachines = data;
				console.log(data);
			},
            error=>						
			{});	
			
			
    }

    subcribeToFormChanges() {
        const myFormStatusChanges$ = this.editUserForm.statusChanges;
        const myFormValueChanges$ = this.editUserForm.valueChanges;
        
        myFormStatusChanges$.subscribe(x => this.events.push({ event: 'STATUS_CHANGED', object: x }));
        myFormValueChanges$.subscribe(x => this.events.push({ event: 'VALUE_CHANGED', object: x }));
    }

    onEditUser(model: any, isValid: boolean) {
        console.log(model);
        this.submitted = true;
        if(isValid)
            this.doEditUser(model);
    }

    doEditUser(model:any){
        console.log("insignup");
        this.loading = true;
        this.userService.update(model)
        .subscribe(
            data => {
                console.log(data);
                localStorage.setItem('currentUserData', JSON.stringify(data));
                this.router.navigate([this.returnUrl]);
                this.alertService.success("Your details have been updated successfully!", true);
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

    openModal(content , _options) {
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
              return  `with: ${reason}`;
          }
      }

      onPasswordUpdated($event) {
          if ($event === 'complete' || $event === 'cancelled') {
            this.modalReference.close();
          }
      }
	  
	  
 getPermission(){
	 var that = this;
	 var pipeParams = {size: {width:300,height:230}, qualityurl: "avq/720p.xml",accountHash:"69a72054090bb8f1a0c614e4e02e00cd", eid:1, showMenu:1, mrt:4220,sis:1,asv:1,mv:1, dpv:0, ao:0, dup:0};
PipeSDK.insert("custom-id", pipeParams,function(recorderInserted){
	console.log("recorderInserted"+recorderInserted);
	that.recorder = recorderInserted;
	that.getRecorder();
           var recbtn = document.getElementById("recordbtn");
	//var stopbtn = document.getElementById("stopbtn");
	var playbtn = document.getElementById("playbtn");
	var pausebtn = document.getElementById("pausebtn");
	var savebtn = document.getElementById("savebtn");
	var removebtn = document.getElementById("removebtn");
	
	//Calling Control API methods when the desktop event function onReadyToRecord() is triggered
	recorderInserted.onReadyToRecord = function(id, type){
		var args = Array.prototype.slice.call(arguments);
		console.log("onReadyToRecord("+args.join(', ')+")");
		
		//enabling the record button
		//recbtn.disabled = false;		
	
	
		
		//stopbtn.onclick = function (){
			//calling the control API method
			//recorderInserted.stopVideo();
			
			//enabling the stop button, disabling the record button
			//stopbtn.disabled = true;
		//}
		
		playbtn.onclick = function (){
			//calling the control API method
			recorderInserted.playVideo();
			
			//enabling pause, disabling play, stop, record and save buttons
	
			
		}
		
		pausebtn.onclick = function (){
			//calling the control API method
			recorderInserted.pause();
			
			//enabling record, play and save buttons, disabling pause and stop buttons
	
		}
		
		savebtn.onclick = function (){
			//calling the control API method
			recorderInserted.save();
			
			//disabling the save button
			
		}
		
	}
	
	removebtn.onclick = function (){
		//calling the control API method
		//recorderInserted.remove();
		
	
	}
	
	
	//DESKTOP EVENTS API
	recorderInserted.userHasCamMic = function(id,camNr, micNr){
		var args = Array.prototype.slice.call(arguments);
		console.log("userHasCamMic("+args.join(', ')+")");
	}
	
	recorderInserted.btRecordPressed = function(id){
		var args = Array.prototype.slice.call(arguments);
		console.log("btRecordPressed("+args.join(', ')+")");
	}
	
	recorderInserted.btStopRecordingPressed = function(id){
		var args = Array.prototype.slice.call(arguments);
		console.log("btStopRecordingPressed("+args.join(', ')+")");
	}
	
	recorderInserted.btPlayPressed = function(id){
		var args = Array.prototype.slice.call(arguments);
		console.log("btPlayPressed("+args.join(', ')+")");
	}
	
	recorderInserted.btPausePressed = function(id){
		var args = Array.prototype.slice.call(arguments);
		console.log("btPausePressed("+args.join(', ')+")");
	}
	
	recorderInserted.onUploadDone = function(recorderId, streamName, streamDuration, audioCodec, videoCodec, fileType, audioOnly, location){
		var args = Array.prototype.slice.call(arguments);
		console.log("onUploadDone("+args.join(', ')+")");
		//console.log("clear interval")
		
		that.changeDetectionRef.detectChanges();
		that.callFinishTest(streamName);
		
		//enabling record, play and save buttons
	
		
	}
	
	recorderInserted.onCamAccess = function(id, allowed){
		var args = Array.prototype.slice.call(arguments);
		document.getElementById("feed").style.visibility="visible";
		document.getElementById("recordbtn").style.visibility="visible";
		document.getElementById("pausebtn").style.visibility="visible";
		console.log("onCamAccess("+allowed+")");
	} 
	
	recorderInserted.onPlaybackComplete = function(id){
		var args = Array.prototype.slice.call(arguments);
		console.log("onPlaybackComplete("+args.join(', ')+")");
		
		//enabling play button, disabling pause button
	
		
	}
	
	recorderInserted.onRecordingStarted = function(id){
		var args = Array.prototype.slice.call(arguments);
		console.log("onRecordingStarted("+args.join(', ')+")");
	}
	
	recorderInserted.onConnectionClosed = function(id){
		var args = Array.prototype.slice.call(arguments);
		console.log("onConnectionClosed("+args.join(', ')+")");
	}
	
	recorderInserted.onConnectionStatus = function(id, status){
		var args = Array.prototype.slice.call(arguments);
		console.log("onConnectionStatus("+args.join(', ')+")");
	}
	
	recorderInserted.onMicActivityLevel = function(id, level){
		var args = Array.prototype.slice.call(arguments);
		//console.log("onMicActivityLevel("+args.join(', ')+")");
	}
	
	recorderInserted.onFPSChange = function(id, fps){
		var args = Array.prototype.slice.call(arguments);
		//console.log("onFPSChange("+args.join(', ')+")");
	}
	
	recorderInserted.onSaveOk = function(recorderId, streamName, streamDuration, cameraName, micName, audioCodec, videoCodec, filetype, videoId, audioOnly, location){
		var args = Array.prototype.slice.call(arguments);
		console.log("onSaveOk("+args.join(', ')+")");
	}
	
	//DESKTOP UPLOAD EVENTS API
	recorderInserted.onFlashReady = function(id){
		var args = Array.prototype.slice.call(arguments);
		console.log("onFlashReady("+args.join(', ')+")");
	}
	
	recorderInserted.onDesktopVideoUploadStarted = function(recorderId, filename, filetype, audioOnly){
		var args = Array.prototype.slice.call(arguments);
		console.log("onDesktopVideoUploadStarted("+args.join(', ')+")");
	}
	
	recorderInserted.onDesktopVideoUploadSuccess = function(recorderId, filename, filetype, videoId, audioOnly, location){
		var args = Array.prototype.slice.call(arguments);
		console.log("onDesktopVideoUploadSuccess("+args.join(', ')+")");
		console.log("upload done proceeding to FINISH TEST");
		
		
	}
	
	recorderInserted.onDesktopVideoUploadFailed = function(id, error){
		var args = Array.prototype.slice.call(arguments);
		console.log("onDesktopVideoUploadFailed("+args.join(', ')+")");
	}
	
	//MOBILE EVENTS API
	recorderInserted.onVideoUploadStarted = function(recorderId, filename, filetype, audioOnly){
		var args = Array.prototype.slice.call(arguments);
		console.log("onVideoUploadStarted("+args.join(', ')+")");
	}

	recorderInserted.onVideoUploadSuccess = function(recorderId, filename, filetype, videoId, audioOnly, location){
		var args = Array.prototype.slice.call(arguments);
		console.log("onVideoUploadSuccess("+args.join(', ')+")");
	}
	
	recorderInserted.onVideoUploadProgress = function(recorderId, percent){
		var args = Array.prototype.slice.call(arguments);
		console.log("onVideoUploadProgress("+args.join(', ')+")");
	}
	
	recorderInserted.onVideoUploadFailed = function(id, error){
		var args = Array.prototype.slice.call(arguments);
		console.log("onVideoUploadFailed("+args.join(', ')+")");
	}
	
});
}

getRecorder(){
	console.log("getrecorder function called"+this.recorder);
}
start(){
	console.log("getrecorder start123");
	this.recorder.record();
	
}

stop(){
	console.log("stopping the video");
	
	var that = this;
	this.updateProgress = setInterval(() => {
    that.updateProgress2(); 
	//this.changeDetectionRef.detectChanges();
  }, 500);
  this.recorder.stopVideo();
}
feed(){
	const video = document.getElementById("custom-id");
	
		  video.style.visibility = (video.style.visibility == "visible")? "hidden" : "visible";  
}

callFinishTest(streamName){
	console.log("clear the interval"+this.updateProgress);
	clearInterval(this.updateProgress);
	console.log("FinishTEST called"+streamName);
	//alert("Finish Test Triggered(After video upload)");
	 const video: HTMLVideoElement = this.video.nativeElement;
	 setTimeout(()=>{
	 video.src="https://eu1-addpipe.s3.eu-central-1.amazonaws.com/69a72054090bb8f1a0c614e4e02e00cd/"+streamName+".mp4";}
	 ,1000);
	this.videoUrl = "https://eu1-addpipe.s3.eu-central-1.amazonaws.com/69a72054090bb8f1a0c614e4e02e00cd/"+streamName+".mp4";
	   video.muted = false;
        video.controls = true;
        video.autoplay = true;
		video.play();
}

updateUploadProgress(){
	console.log("In update upload progress");
	var elem = document.getElementById("pipeMsgOverlay-custom-id");
	console.log(elem);
	document.getElementById("pip-progress").innerText = ""+elem.innerText;
	
	//this.changeDetectionRef.detectChanges();
}
updateProgress2(){
	this.counter++;
	console.log("update2");
	document.getElementById("pip-progress").innerText = ""+this.counter;
	try{
	console.log("INNER:"+document.getElementById("pipeMsgOverlay-custom-id").innerHTML);
	document.getElementById("pip-progress").innerHTML = document.getElementById("pipeMsgOverlay-custom-id").innerHTML;
	
	}catch(e){
		console.log(e);
	}
}
checkInterval(){
		this.updateProgress = setInterval(() => {
    this.updateProgress2(); 
	//this.changeDetectionRef.detectChanges();
  }, 500);
}

cancelInterval(){
	clearInterval(this.updateProgress);
	console.log("clearedd");
}
}