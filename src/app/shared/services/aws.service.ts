import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { Environment } from '../../../models/environments.interface';
import * as appConfig from './config'; 


@Injectable()
export class AwsService {
    constructor(private http: Http) { }

    listAmis(filter=null) {
        return this.http.get(appConfig.SERVER_URL+'/'+appConfig.SERVER_PATH+'/awsamis'+this._addFilterText(filter), this.jwt()).map((response: Response) => response.json());
    }

    launchInstance(amiId: string) {
        return this.http.get(appConfig.SERVER_URL+'/'+appConfig.SERVER_PATH+'/createinstance/' + amiId, this.jwt()).map((response: Response) => response.json());
    }
	//dj:
	startInstance(instanceId: string) {
        return this.http.get(appConfig.SERVER_URL+'/'+appConfig.SERVER_PATH+'/startinstance/' + instanceId, this.jwt()).map((response: Response) => response.json());
    }
    
	   getInstanceStatus(instanceId: string) {
        return this.http.get(appConfig.SERVER_URL+'/'+appConfig.SERVER_PATH+'/machinestatus/' + instanceId, this.jwt()).map((response: Response) => response.json());
    }

    count(filter=null) {
        return this.http.get(appConfig.SERVER_URL+'/'+appConfig.SERVER_PATH+'/candidates/count'+this._addFilterText(filter), this.jwt()).map((response: Response) => response.json());
    }
	
	    createAmi(environment: Environment) {
        return this.http.get(appConfig.SERVER_URL+'/'+appConfig.SERVER_PATH+'/createami/' + environment.instanceid+'/amiof_'+environment.instanceid+'/'+environment.name, this.jwt()).map((response: Response) => response.json());
    }
	
		    getPassword(instanceId: string) {
        return this.http.get(appConfig.SERVER_URL+'/'+appConfig.SERVER_PATH+'/getpassword/' + instanceId, this.jwt()).map((response: Response) => response.json());
    }

    // update(onlineTest: Candidate) {
    //     return this.http.put('/'+appConfig.SERVER_PATH+'/candidates/' + onlineTest.id, onlineTest, this.jwt()).map((response: Response) => response.json());
    // }

    delete(id: number) {
        return this.http.delete(appConfig.SERVER_URL+'/'+appConfig.SERVER_PATH+'/candidates/' + id, this.jwt()).map((response: Response) => response.json());
    }


    checkIfMachineLaunched(id) {
        return this.http.get(appConfig.SERVER_URL+'/'+appConfig.SERVER_PATH+'/candidates/checkIfSolutionMachine?id='+id, this.jwt()).map((response: Response) => response.json());
    }
    //dj
	getAvailableStoppedMachines(testId) {
        return this.http.get(appConfig.SERVER_URL+'/'+appConfig.SERVER_PATH+'/awsinstances/'+testId, this.jwt()).map((response: Response) => response.json());
    }
    getRdpLink(inputs: any) {

        if (!inputs.testToken) {
            inputs.testToken = this._makeid();
        }
        return this.http.post(appConfig.SERVER_URL+'/'+appConfig.SERVER_PATH+'/candidates/addguacentry/',inputs, this.jwt()).map((response: Response) => response.json());
    }

    addMachinEntry(obj) {
        if (!obj.inviteId) {
            obj.inviteId = this._makeid();
        }
        return this.http.post(appConfig.SERVER_URL+'/'+appConfig.SERVER_PATH+'/candidates/addmachineentry', obj, this.jwt()).map((response: Response) => response.json());
    }
	
    addMachinEntry_V2(obj) {
        if (!obj.inviteId) {
            obj.inviteId = this._makeid();
        }
        return this.http.post(appConfig.SERVER_URL+'/'+appConfig.SERVER_PATH+'/candidates/addmachineentry_v2', obj, this.jwt()).map((response: Response) => response.json());
    }

	getHttpStatusCode(url,port){
	  return this.http.get(appConfig.SERVER_URL+'/'+appConfig.SERVER_PATH+'/candidates/gethttprequeststatus/?url='+url+'&port='+port, this.jwt()).map((response: Response) => response.json());
	}	
	
	//ECS
	startTask(taskDetails) {
	    let type = "na";
	    if(taskDetails.type){
		 type = taskDetails.type;
		}
		console.log("type="+type);
        return this.http.get(appConfig.SERVER_URL+'/'+appConfig.SERVER_PATH+'/starttask/'+taskDetails.taskId+'/'+taskDetails.testId+'/'+taskDetails.inviteId+'/'+taskDetails.containerName +'/'+encodeURIComponent(taskDetails.gitUrl) + '/'+type + '/'+ taskDetails.projectName + '/'+ taskDetails.containerPath, this.jwt()).map((response: Response) => response.json());
    }
	startTaskService(ServiceDetails) {
        return this.http.get(appConfig.SERVER_URL+'/'+appConfig.SERVER_PATH+'/startservice/'+ServiceDetails.name+'/'+ServiceDetails.inviteId+'/'+ServiceDetails.taskId+'/'+ServiceDetails.containerName, this.jwt()).map((response: Response) => response.json());
    }	
	getTaskServiceInfo(serviceName) {
        return this.http.get(appConfig.SERVER_URL+'/'+appConfig.SERVER_PATH+'/getserviceinfo/'+serviceName, this.jwt()).map((response: Response) => response.json());
    }	
	getTasksIp(taksId,launchType){
	  return this.http.get(appConfig.SERVER_URL+'/'+appConfig.SERVER_PATH+'/gettasksip/'+taksId+'/'+launchType, this.jwt()).map((response: Response) => response.json());
	}
	stopTask(taksId){
	  return this.http.get(appConfig.SERVER_URL+'/'+appConfig.SERVER_PATH+'/stoptask/'+taksId, this.jwt()).map((response: Response) => response.json());
	}
	
    // private helper methods

    private jwt() {
        // create authorization header with jwt token
        let currentUser = JSON.parse(localStorage.getItem('currentUser'));
        if (currentUser && currentUser.id) {
            let headers = new Headers({ 'Authorization': currentUser.id });
            return new RequestOptions({ headers: headers });
        } else{
            let headers = new Headers({ 'Content-Type': 'application/json' });
            return new RequestOptions({ headers: headers });
        }
    }

    private _addFilterText(filter){
        let queryString = '';
        if(filter){
            queryString = "?filter="+JSON.stringify(filter);
        }
        
        return queryString;
    }
	
	


    private _makeid() {
        let text = "";
        const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

        for (let i = 0; i < 9; i++) {
            text += possible.charAt(Math.floor(Math.random() * possible.length));
        }
        return text;
    }
}