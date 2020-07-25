import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class QuizService {

  constructor(private http: HttpClient) { }

  get(url: string) {
    return this.http.get(url);
  }

  getAll() {
    return [
      { id: 'assets/data/aspnet.json', name: 'Asp.Net' },
      { id: 'assets/data/csharp.json', name: 'C Sharp' },
      { id: 'assets/data/designPatterns.json', name: 'Design Patterns' }
    ];
  }

}
