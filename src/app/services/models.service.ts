import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { AuthService } from '../auth/auth.service';
import { Model } from '../models/Model';

@Injectable({
  providedIn: 'root'
})
export class ModelsService {

  constructor(
    private auth: AuthService,
    private http: HttpClient,
  ) { }

  getModel(id: number): Promise<Model> {
    return new Promise((resolve, reject) => {
      this.http.get(`${environment.apiUrl}/models/${id}/get`, {
        headers: {
          ...this.auth.getHeaders(),
        }
      }).toPromise().then(res => {
        resolve(res as Model);
      }).catch(err => {
        console.error('Error getting model', err);
        reject(err);
      });
    });
  }

  getModels(): Promise<Model[]> {
    return new Promise((resolve, reject) => {
      this.http.get(`${environment.apiUrl}/models/list`, {
        headers: {
          ...this.auth.getHeaders(),
        }
      }).toPromise().then(res => {
        resolve(res as Model[]);
      }).catch(err => {
        console.error('Error getting models', err);
        reject(err);
      });
    });
  }

  executeModel(id: number, values: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this.http.post(`${environment.apiUrl}/models/${id}/simulate`, { values }, {
        headers: {
          ...this.auth.getHeaders(),
        }
      }).toPromise().then(res => {
        resolve(res);
      }).catch(err => {
        console.error('Error running model', err);
        reject(err);
      });
    });
  }


}
