import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import * as appConfig from './config';

@Injectable()
export class Diff2HTMLService {
    constructor(private http: Http) { }

    fetchDiff(url) {
        return this.http.get(url, this.jwt()).map((response: Response) => response.text());
    }


    // private helper methods

    private jwt() {

        const headers = new Headers({ 'Accept': 'application/vnd.github.v3.diff' });
        return new RequestOptions({ headers: headers });
    }
}
