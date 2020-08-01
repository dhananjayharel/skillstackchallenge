import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import * as appConfig from './config'; 
import { Candidate } from '../../../models';

@Injectable()
export class CandidateService {
    constructor(private http: Http) { }

    getAll(filter=null) {
        return this.http.get(appConfig.SERVER_URL+'/'+appConfig.SERVER_PATH+'/challengesessions'+this._addFilterText(filter), this.jwt()).map((response: Response) => response.json());
    }

    getById(id: number) {
        return this.http.get(appConfig.SERVER_URL+'/'+appConfig.SERVER_PATH+'/challengesessions/' + id, this.jwt()).map((response: Response) => response.json());
    }

    create(candidate: Candidate) {
        return this.http.post(appConfig.SERVER_URL+'/'+appConfig.SERVER_PATH+'/candidates', candidate, this.jwt()).map((response: Response) => response.json());
    }

    count(filter=null) {
        return this.http.get(appConfig.SERVER_URL+'/'+appConfig.SERVER_PATH+'/candidates/count'+this._addFilterText(filter), this.jwt()).map((response: Response) => response.json());
    }

     update(candidate: Candidate) {
         return this.http.put(appConfig.SERVER_URL+'/'+appConfig.SERVER_PATH+'/candidates/' + candidate.id, candidate, this.jwt()).map((response: Response) => response.json());
     }

    delete(id: number) {
        return this.http.delete(appConfig.SERVER_URL+'/'+appConfig.SERVER_PATH+'/candidates/' + id, this.jwt()).map((response: Response) => response.json());
    }

    createAmi(details: any) {
        return this.http.post(appConfig.SERVER_URL+'/'+appConfig.SERVER_PATH+'/candidates/createami/',details, this.jwt()).map((response: Response) => response.json());
    }

    reSendInvite(id) {
        return this.http.get(appConfig.SERVER_URL+'/'+appConfig.SERVER_PATH+'/candidates/resendinvite?id='+id, this.jwt()).map((response: Response) => response.json());
    }


    shareVideoUrl(obj) {
        return this.http.post(appConfig.SERVER_URL+'/'+appConfig.SERVER_PATH+'/candidates/sharevideourl', obj, this.jwt()).map((response: Response) => response.json());
    }

    getLeaderboard() {
        return this.http.get(appConfig.SERVER_URL + '/'+appConfig.SERVER_PATH+'/candidates/leaderboard', this.jwt()).map((response: Response) => response.json());
    }

    getCandidatesStats(filter=null) {
        return this.http.get(appConfig.SERVER_URL+'/'+appConfig.SERVER_PATH+'/candidates/count'+this._addWhereText(filter), this.jwt()).map((response: Response) => response.json());
    }

    getCandidatesLeaderboard(filter=null) {
        return this.http.get(appConfig.SERVER_URL + '/'+appConfig.SERVER_PATH+'/candidates/leaderboard'+this._addWhereText(filter), this.jwt()).map((response: Response) => response.json());
    }
	
	    getCandidatesCurrentRunningMachines(filter=null) {
        return this.http.get(appConfig.SERVER_URL + '/'+appConfig.SERVER_PATH+'/candidates/currentmachines?id=1'+this._addWhereText(filter), this.jwt()).map((response: Response) => response.json());
    }
	getAllRunningMachines(filter=null) {
        return this.http.get(appConfig.SERVER_URL + '/'+appConfig.SERVER_PATH+'/candidates/allmachines?id=1'+this._addWhereText(filter), this.jwt()).map((response: Response) => response.json());
    }
	//AWS ECS
	finishTest(candidateId: number) {
        return this.http.get(appConfig.SERVER_URL + '/'+appConfig.SERVER_PATH+'/candidates/finishtest?id='+candidateId, this.jwt()).map((response: Response) => response.json());
    }
	addContainerMapping(containerPath: string,taskId: string) {
        return this.http.get(appConfig.SERVER_URL + '/'+appConfig.SERVER_PATH+'/candidates/addcontainermapping?containerpath='+containerPath+"&taskid="+taskId, this.jwt()).map((response: Response) => response.json());
    }
	
    addNginxProxyEntry(containerPath: string, publicIp: string, editorPort: string, outPutPort: string) {
        return this.http.get(appConfig.SERVER_URL + '/'+appConfig.SERVER_PATH+'/candidates/addtheiaentry?editorpath='+containerPath+"&publicip="+publicIp+"&editorport="+editorPort+"&outputport="+outPutPort, this.jwt()).map((response: Response) => response.json());
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
        if (filter) {
            queryString = "?filter="+JSON.stringify(filter);
        }
        return queryString;
    }

    private _addWhereText(filter){
        let queryString = '';
        if (filter) {
            queryString = "?where="+JSON.stringify(filter);
        }
        return queryString;
    }
}