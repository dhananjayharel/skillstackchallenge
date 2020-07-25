import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import * as appConfig from './config'; 
import { Environment } from '../../../models';

@Injectable()
export class EnvironmentService {
    constructor(private http: Http) { }

    getAll(filter=null) {
        return this.http.get(appConfig.SERVER_URL+'/api/environments'+this._addFilterText(filter), this.jwt()).map((response: Response) => response.json());
    }
	
	    getAllEnvs(id: number) {
        return this.http.get(appConfig.SERVER_URL+'/api/environments/getallenvs?id='+id, this.jwt()).map((response: Response) => response.json());
    }
	
	
	   getBaseAmiDetails(amiId: string) {
        return this.http.get(appConfig.SERVER_URL+'/api/environments/getbaseamidetails?id='+amiId, this.jwt()).map((response: Response) => response.json());
    }
	
	  createAmi(id: number) {
        return this.http.get(appConfig.SERVER_URL+'/api/environments/createami?id='+id, this.jwt()).map((response: Response) => response.json());
    }

    getById(id: number) {
        return this.http.get(appConfig.SERVER_URL+'/api/environments/' + id, this.jwt()).map((response: Response) => response.json());
    }

    create(environment: Environment) {
        return this.http.post(appConfig.SERVER_URL+'/api/environments', environment, this.jwt()).map((response: Response) => response.json());
    }

    count(filter=null) {
        return this.http.get(appConfig.SERVER_URL+'/api/environments/count'+this._addFilterText(filter), this.jwt()).map((response: Response) => response.json());
    }

    getPublicIP(instanceId=null) {
        return this.http.get(appConfig.SERVER_URL+'/api/candidates/getmachinepublicip?instanceid='+instanceId, this.jwt()).map((response: Response) => response.json());
    }

    update(environment: Environment) {
         return this.http.put(appConfig.SERVER_URL+'/api/environments/' + environment.id, environment, this.jwt()).map((response: Response) => response.json());
     }

    delete(id: number) {
        return this.http.delete(appConfig.SERVER_URL+'/api/environments/' + id, this.jwt()).map((response: Response) => response.json());
    }

        cloneEnvironments(id: number) {
        return this.http.get(appConfig.SERVER_URL+'/api/environments/cloneenvs?id=' + id, this.jwt()).map((response: Response) => response.json());
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
}