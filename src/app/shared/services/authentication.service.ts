import { Injectable } from '@angular/core';
import { Http, Headers, Response, RequestOptions} from '@angular/http';
import { Observable } from 'rxjs/Observable';
import * as appConfig from './config';
import 'rxjs/add/operator/map'
 
@Injectable()
export class AuthenticationService {
    constructor(private http: Http) { }

    getLoggedInUserDetails(){

    }

    validateEmail(email) {
        return this.http.get('http://apilayer.net/api/check?access_key=db4ab2cfa09efe5d76b5d05b269add3e&email='+ email +'&smtp=1&format=1').map(res => res.json());
    }

    login(email: string, password: string) {
        let body = JSON.stringify({ 'email': email, 'password': password });
        return this.http.post(appConfig.SERVER_URL+'/api/Users/login', 
            body, this.jwt())
            .map((response: Response) => {
                // login successful if there's a jwt token in the response
                const user = response.json();
                if (user && user.id) {
                    // store user details and jwt token in local storage to keep user logged in between page refreshes
                    localStorage.setItem('currentUser', JSON.stringify(user));
                    localStorage.setItem('isLoggedin', 'true');
                }
                return user;
            });
    }
 
    logout() {
        // remove user from local storage to log user out
        localStorage.removeItem('currentUser');
        localStorage.removeItem('currentUserData');
        localStorage.removeItem('isLoggedin');
        return this.http.post(appConfig.SERVER_URL +'/api/Users/logout',this.jwt())
            .map((response: Response) => {
                console.log(response);
               
                // store user details and jwt token in local storage to keep user logged in between page refreshes
                localStorage.removeItem('currentUser');
                localStorage.removeItem('currentUserData');
                localStorage.removeItem('isLoggedin');
            });
    }

    requestForgotPassword(email: string) {
        let body = JSON.stringify({ 'email': email });
        return this.http.post(appConfig.SERVER_URL +'/api/Users/request-password-reset', body,
        this.jwt())
            .map((response: Response) => {
                console.log(response);
               
            });
    }

    resetPassword(password: string, email: string, id: string) {
        let body = JSON.stringify({ 'email': email, 'password': password });
        return this.http.post(appConfig.SERVER_URL +'/api/Users/reset?access_token='+id, body,
        this.jwt())
            .map((response: Response) => {
                console.log(response);
               
            });
    }

    confirmAccount(uid: number, id: string) {
        return this.http.get(
            appConfig.SERVER_URL + '/api/Users/confirm?uid=' + uid + '&token=' + id,
            this.jwt()
        ).map((response: Response) => response.json());
    }

    getUser(uid: number, id: string) {
        return this.http.get(appConfig.SERVER_URL+'/api/Users/' + uid + '?access_token='+id, this.jwt()).map((response: Response) => response.json());
    }

    private jwt() {
        // create authorization header with jwt token
        let currentUser = JSON.parse(localStorage.getItem('currentUser'));
        if (currentUser && currentUser.token) {
            let headers = new Headers({ 'Authorization': 'Bearer ' + currentUser.id,
                                        'Content-Type': 'application/json' });
            return new RequestOptions({ headers: headers });
        } else{
            let headers = new Headers({ 'Content-Type': 'application/json' });
            return new RequestOptions({ headers: headers });
        }
    }
}