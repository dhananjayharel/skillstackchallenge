import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import * as appConfig from './config'; 
import { OnlineTest } from '../../../models';

@Injectable()
export class OnlineTestService {
    constructor(private http: Http) { }

    getAll(filter=null) {
        return this.http.get(appConfig.SERVER_URL+'/api/onlinetests' +
            this._addFilterText(filter), this.jwt()).map((response: Response) => response.json());
    }

    getById(id: number) {
        return this.http.get(appConfig.SERVER_URL +
            '/api/onlinetests/' + id, this.jwt()).map((response: Response) => response.json());
    }

    create(onlineTest: OnlineTest) {
        return this.http.post(appConfig.SERVER_URL +
            '/api/onlinetests', onlineTest, this.jwt()).map((response: Response) => response.json());
    }

    count(filter=null) {
        return this.http.get(appConfig.SERVER_URL + '/api/onlinetests/count' +
            this._addFilterText(filter), this.jwt()).map((response: Response) => response.json());
    }

    uploadFileToS3(url: string, file: any) {
        let head = new Headers({ 'Content-Type': file.type });
        return this.http.put(url, file, { headers: head }).map((response: Response) => response.json());
    }

    getPresignedUploadUrl(path: string, type: string) {
        return this.http.get(appConfig.SERVER_URL + '/api/onlinetests/getPresignedUploadUrl?path=' + path + '&type=' + type,
            this.jwt()).map((response: Response) => response.json());
    }

    clone(data) {
        let queryParam = '';
        for (const key in data) {
            if (data.hasOwnProperty(key)) {
                const val = data[key];
               queryParam += key + '=' + data[key]  + '&';
            }
        }
        queryParam = queryParam.substring(0, queryParam.length - 1);
        return this.http.post(appConfig.SERVER_URL+'/api/onlinetests/clonetest?'+queryParam, this.jwt()).map((response: Response) => response.json());
    }

    update(onlineTest: OnlineTest) {
        return this.http.put(appConfig.SERVER_URL+'/api/onlinetests/' + onlineTest.id, onlineTest, this.jwt()).map((response: Response) => response.json());
    }

    delete(id: number) {
        return this.http.delete(appConfig.SERVER_URL+'/api/onlinetests/' + id, this.jwt()).map((response: Response) => response.json());
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