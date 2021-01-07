import { AuthService } from 'src/app/auth/auth.service';
import { User } from './../models/User';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  currentUser: BehaviorSubject<User> = new BehaviorSubject<User>(null);

  constructor(
    private http: HttpClient,
    private auth: AuthService,
  ) {
    this.currentUser.next(null);
  }

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

  getCurrentUser(): Promise<User> {
    return new Promise((resolve, reject) => {
      this.http.get(`${environment.apiUrl}/users/me`, {
        headers: {
          ...this.auth.getHeaders(),
        }
      }).toPromise().then(res => {
        console.log('Finished getting current user');

        this.currentUser.next(res as User);

        if (!res) {
          this.logout();
        }

        resolve(res as User);
      }).catch(err => {
        console.error('Error creating user', err);
        reject(err);
      });
    });
  }

  getUsers(): Promise<User[]> {
    return new Promise((resolve, reject) => {
      this.http.get(`${environment.apiUrl}/users/list`, {
        headers: {
          ...this.auth.getHeaders(),
        }
      }).toPromise().then(res => {
        console.log('Finished getting current user');
        resolve(res as User[]);
      }).catch(err => {
        console.error('Error creating user', err);
        reject(err);
      });
    });
  }

  logout(): void {
    this.auth.logout();
    this.currentUser.next(null);
  }

}
