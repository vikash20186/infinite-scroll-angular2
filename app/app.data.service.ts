import { Injectable } from '@angular/core';
import { Headers, Http } from '@angular/http';

import 'rxjs/add/operator/toPromise';

@Injectable()
export class DataService {
  constructor(private http: Http) { }
  
  getData(): Promise<any[]> {
    return this.http.get("data.json")
               .toPromise()
               .then(response => response.json())
               .catch(this.handleError);
  }
  
  handleError(){
    console.error("error in loading data", arguments);
  }
}