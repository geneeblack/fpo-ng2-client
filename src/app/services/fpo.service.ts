import { Injectable } from '@angular/core';
import { Headers, Http } from '@angular/http';

import 'rxjs/Rx';

import { Observable }     from 'rxjs/Observable';

@Injectable()
export class FPOService {

    private headers = new Headers({'Content-Type': 'application/json'});
    private fpoBaseUrl = '';

    constructor(private http: Http) {

    }


    getLoadCalculatorByBatch(applicator_id:number, batch_id:number): Observable<any> {
        let fpoLoadCalculatorUrl = `${this.fpoBaseUrl}/applicators/${applicator_id}/batches/${batch_id}/load_calculator/batch_load_calculator`;
        return this.http.get(fpoLoadCalculatorUrl, {withCredentials: true})
                .map(response => response.json())
                .catch((error:any) => 
                    Observable.throw(error.json().error || 'Server error, unable to retrieve data.')
                );
    }

    getLoadCalculatorByJobs(partnership_id:number, jobs:[number]): Observable<any> {
        let fpoLoadCalculatorUrl = `${this.fpoBaseUrl}/partnerships/${partnership_id}/jobs/${JSON.stringify(jobs)}/load_calculator`;
        return this.http.get(fpoLoadCalculatorUrl, {withCredentials: true})
                .map(response => response.json())
                .catch((error:any) => 
                    Observable.throw(error.json().error || 'Server error, unable to retrieve data.')
                );
    }

}