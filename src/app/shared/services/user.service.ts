import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import * as appConfig from './config'; 
import { User } from '../../../models/index';

@Injectable()
export class UserService {
    constructor(private http: Http) { }

    getAll() {
        return this.http.get(appConfig.SERVER_URL+'/'+appConfig.SERVER_PATH+'/users', this.jwt()).map((response: Response) => response.json());
    }

    getById(id: number) {
        return this.http.get(appConfig.SERVER_URL+'/'+appConfig.SERVER_PATH+'/Users/' + id, this.jwt()).map((response: Response) => response.json());
    }

    create(user: User) {
        return this.http.post(appConfig.SERVER_URL+'/'+appConfig.SERVER_PATH+'/Users', user, this.jwt()).map((response: Response) => response.json());
    }

    update(user: User) {
        return this.http.put(appConfig.SERVER_URL+'/'+appConfig.SERVER_PATH+'/users/' + user.id, user, this.jwt()).map((response: Response) => response.json());
    }

    delete(id: number) {
        return this.http.delete(appConfig.SERVER_URL+'/'+appConfig.SERVER_PATH+'/users/' + id, this.jwt()).map((response: Response) => response.json());
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
}