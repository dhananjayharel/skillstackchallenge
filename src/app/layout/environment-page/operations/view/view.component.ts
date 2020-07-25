import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import { Environment } from '../../../../../models/environments.interface';
import {EnvironmentService, AlertService, AwsService} from '../../../../shared';
import {Observable} from 'rxjs/Rx';

@Component({
    selector: 'app-onlinetest-view',
    templateUrl: './view.component.html',
    styleUrls: ['./view.component.scss']
})
export class ViewComponent implements OnInit {
    private _id:number;
    public environment: Environment;
    public loading: boolean;  
	public tickerloading: boolean;
	public currentStatus: string;
	public statusText: string;
	public baseAmiDetails: string;
	public launchStarted: boolean;
	public machinePassword: string;
	public secondsRemaining: number;
	public showLoginDetails: boolean;
	public rdpLink: string;
	public instanceId: string;

    alerts: Array<any> = [];
    constructor(private route:ActivatedRoute,
                private environmentService: EnvironmentService,
                private awsService: AwsService,				
                private alertService: AlertService) {
    }

    ngOnInit() {
             this._id = this.route.snapshot.params['id'];
        this.loading = true;
		this.launchStarted = false;
		this.currentStatus="NA";
		this.secondsRemaining = 180;
		this.showLoginDetails = false;
        this.environmentService.getById(this._id)
            .subscribe(
                data => {
                    //this.router.navigate([this.returnUrl]);
                    //this.alertService.success("The Online test has been saved.", true);
                    console.log(data);
                    this.environment = data;
					if(this.environment.instanceid.trim().length>0) {
						this.monitor();
					    this.launchStarted = true ;
						this.showLoginDetails = true;
					}
                    this.loading = false;
					this.getBaseAmiDetails();
                },
                error => {
                    const err = JSON.parse(error._body);
                    this.alertService.error(err.error.message);
                    this.loading = false;
                });
	}
	
	getBaseAmiDetails(){
		       this.environmentService.getBaseAmiDetails(this.environment.base_imageid)
            .subscribe(
                data => {
                    //this.router.navigate([this.returnUrl]);
                    //this.alertService.success("The Online test has been saved.", true);
                    console.log(data);
					this.baseAmiDetails=data.name+" ("+data.description+")"
                },
                error => {
                    var err = JSON.parse(error._body);
                    this.alertService.error(err.error.message);
                    this.loading = false;
                });
		
	}    
    launchInstance(){
		this.statusText="Checking....";
		this.environment.instanceid="";
		var instanceToLaunch="";
		if(this.environment.amiid)
			instanceToLaunch = this.environment.amiid;
		else
			instanceToLaunch = this.environment.base_imageid;
          this.awsService.launchInstance(instanceToLaunch)
            .subscribe(
                data => {
                    console.log("launching instance");                   
					this.environment.instanceid=data.instanceId;
					this.launchStarted=true;
					//console.log("update with instance id"+this.environment.instanceid);
					 this.monitor();
					 this.startCountDown();
					this.statusText="Launching...";
					this.getPassword();
					this.launchMachineEntry();
					//now update environment
						this.environmentService.update(this.environment)
							.subscribe(
								data => {
								console.log(data);   
								console.log("updated");		
								},
							error => {
							var err = JSON.parse(error._body);
							this.alertService.error(err.error.message);
							this.loading = false;
						});
					
					},
                error => {
                    var err = JSON.parse(error._body);
                    this.alertService.error(err.error.message);
                    this.loading = false;
                });
        
    }
	
	  monitor(){	 
	  this.loading=true;
	  const stopTimer$ = Observable.timer(1 * 60 * 1000);
     let timer:any = Observable.timer(50,4000).takeUntil(stopTimer$);
	  
	let subscription = timer.subscribe(data => {
	
        if(this.currentStatus=="initializing"){
			console.log("UNSUBSCRIB");
			subscription.unsubscribe();
			 this.statusText="Done";
		}
	    this.checkMachineStatus(subscription);
 });
  }
  
    startCountDown(){
    let timer:any = Observable.timer(1,1000);
    let subscription = timer.subscribe(data => {
	
        if(this.secondsRemaining==0){
			console.log("UNSUBSCRIB");
			subscription.unsubscribe();
		}else
	    this.secondsRemaining--;
 });
  }

    checkMachineStatus(subscription) {
    this.awsService.getInstanceStatus(this.environment.instanceid)
    .subscribe(
      data => {
	     console.log("x"+data.state);
          if(data.error){
		  data.state='Machine not available';this.currentStatus='Remote machine not available';this.environment.instanceid='';this.environment.commited=true;
		  subscription.unsubscribe();
		  }
		 //this.currentStatus=JSON.parse(data['_body']).SystemStatus.Status;
		this.currentStatus = data.state;
		console.log("this.currentStatus" + this.currentStatus);
	  if(data.state === 'initializing' || data.state === 'ok'){
		  this.loading = false;
	      this.statusText = "Done";
	  }
	  
	  },
      error => {var err = JSON.parse(error._body); subscription.unsubscribe();console.log("EEE");
                    this.alertService.error(err.error.message);},
      () => console.log('Monitor Status Complete')
    );

  }

	commitInstance() {
		var r = confirm("Are you sure you want to commit the changes made to this environment?");
		if (r === true) {
			this.environmentService.createAmi(this.environment.id)
			.subscribe(
						data => {
						console.log("create image resp="+JSON.stringify(data));
						//alert("AMI for this envornment is created");

						this.environment = data;
						this.environment.amiid = data.amiid;
						this.environment.instanceid = data.instanceid;
						this.environment.pwd = this.machinePassword;
						this.launchStarted = false;
						this.machinePassword = "";
						this.currentStatus = "";
						//alert("AMI for this envornment is created and will be available for create test");		
						
						this.alertService.success('Changes are committed. Environment has been updated!');
					
				},
				error => {var err = JSON.parse(error._body);
								this.alertService.error(err.error.message);},
				() => console.log('#')
				);
		}

  }

        getPassword() { this.loading = true;
    this.awsService.getPassword(this.environment.base_imageid)
    .subscribe(
      data => {
		console.log("get password=" + data);
		this.machinePassword = data.pwd;this.loading = false;
		this.environment.pwd = this.machinePassword;
		this.environmentService.update(this.environment)
		.subscribe(
			data => {this.loading = false; this.getRDPLink();},
			error => {
				var err = JSON.parse(error._body);
				this.alertService.error(err.error.message);
				this.loading = false;
			});
		
	  },
      error => {var err = JSON.parse(error._body);
                    this.alertService.error(err.error.message);}
    );

  }    

    public closeAlert(alert: any) {
        const index: number = this.alerts.indexOf(alert);
        this.alerts.splice(index, 1);
    }
	
	showRDPDetails(event){
		if(event === "complete"){
			this.showLoginDetails = true;
		}
	} 

	getRDPLink () {
        // const warningStr = 'The web link is best used when you are having problems using an actual RDP client. Do you really want to continue?';
        // if (!this.rdpLink) {
        //     const r = confirm(warningStr);
        //     if ( r === true ) {
                const inputs = {
                    instanceId: this.environment.instanceid,
                    pwd: this.machinePassword
                };
                this.awsService.getRdpLink(inputs)
                .subscribe(
                    data => {
                        console.log(data);
                        this.rdpLink = data.link;
                        // if (!window.open(data.link, '_blank')) {
                        //     this.alertService.error('Unable to open the page in new tab. Please enable popup from the settings page.');
                        // }
                    },
                    error => {
                        const err = JSON.parse(error._body);
                        this.alertService.error(err.error.message);
                    }
                );
    //         }
    //     }
}

	launchMachineEntry(){
      const input = {
          type: 'recruiter',
          inviteId: '',
          duration: 60,
          gitUrl: this.environment['git_url'],
          instanceId: this.environment.instanceid,
          fullname: '',
          email: '',
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
}
