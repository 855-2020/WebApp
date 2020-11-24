import { environment } from './../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Sector } from '../models/Sector';

@Injectable({
  providedIn: 'root'
})
export class SectorsService {

  constructor(
    private http: HttpClient,
  ) { }

  getSectors(): Promise<Sector[]> {
    return new Promise((resolve, reject) => {
      this.http.get(`${environment.apiUrl}/sectors/\{model_id\}/list?_model_id=0`).toPromise().then(res => {
        console.log('Finished getting sectors');
        resolve(res as Sector[]);
      }).catch(err => {
        console.error('Error getting sectors', err);
        reject(err);
      });
    });
  }
}
