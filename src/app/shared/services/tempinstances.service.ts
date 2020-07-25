import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import * as appConfig from './config';
import { TempInstance } from '../../../models';

@Injectable()
export class TempInstanceService {
    constructor(private http: Http) { }

    getAll(filter=null) {
        return this.http.get(appConfig.SERVER_URL+'/api/tempinstances'+this._addFilterText(filter), this.jwt()).map((response: Response) => response.json());
    }

    getById(id: number) {
        return this.http.get(appConfig.SERVER_URL+'/api/tempinstances/' + id, this.jwt()).map((response: Response) => response.json());
    }

    create(candidate: TempInstance) {
        return this.http.post(appConfig.SERVER_URL+'/api/tempinstances', candidate, this.jwt()).map((response: Response) => response.json());
    }

    count(filter=null) {
        return this.http.get(appConfig.SERVER_URL+'/api/tempinstances/count'+this._addFilterText(filter), this.jwt()).map((response: Response) => response.json());
    }

     update(candidate: TempInstance) {
         return this.http.put(appConfig.SERVER_URL+'/api/tempinstances/' + candidate.id, candidate, this.jwt()).map((response: Response) => response.json());
     }

    delete(id: number) {
        return this.http.delete(appConfig.SERVER_URL+'/api/tempinstances/' + id, this.jwt()).map((response: Response) => response.json());
    }

    // private helper methods

    private jwt() {
        // create authorization header with jwt token
        const  currentUser = JSON.parse(localStorage.getItem('currentUser'));
        if (currentUser && currentUser.id) {
            const headers = new Headers({ 'Authorization': currentUser.id });
            return new RequestOptions({ headers: headers });
        } else {
            const headers = new Headers({ 'Content-Type': 'application/json' });
            return new RequestOptions({ headers: headers });
        }
    }

    private _addFilterText(filter){
        let queryString = '';
        if(filter){
            queryString = '?filter=' +JSON.stringify(filter);
        }

        return queryString;
    }
}