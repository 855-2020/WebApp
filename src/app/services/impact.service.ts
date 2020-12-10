import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Sector } from '../models/Sector';

@Injectable({
  providedIn: 'root'
})
export class ImpactService {

  constructor(
    private http: HttpClient,
  ) { }

  getImpactNames(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.http.get(`${environment.apiUrl}/activities/list`).toPromise().then(res => {
        console.log('Finished getting impact categories');
        resolve(res);
      }).catch(err => {
        console.error('Error getting sectors', err);
        reject(err);
      });
    });
  }

  getImpactValues(values: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this.http.post(`${environment.apiUrl}/impact`, values).toPromise().then(res => {
        console.log('Finished getting impact values');
        resolve(res);
      }).catch(err => {
        console.error('Error getting sectors', err);
        reject(err);
      });
    });
  }

  getIntermediateData(sectors: Sector[], values: any): Promise<any> {
    return new Promise((resolve, reject) => {
      Promise.all(
        sectors.map(s => this.http.post(`${environment.apiUrl}/activity/${s.id}/${values[s.id]}`, {}).toPromise())
      ).then(res => {
        console.log('Finished getting sectors');
        resolve(res.map((r, i) => ({ sector: sectors[i], values: r })));
      }).catch(err => {
        console.error('Error getting sectors', err);
        reject(err);
      });
    });
  }

}
