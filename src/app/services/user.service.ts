import { User } from './../models/User';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(
    private http: HttpClient,
  ) { }

  createUser(user: User, password: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this.http.post(`${environment.apiUrl}/users/create`, { ...user, password }).toPromise().then(res => {
        console.log('Finished creating user');
        resolve(res);
      }).catch(err => {
        console.error('Error creating user', err);
        reject(err);
      });
    });
  }

}
