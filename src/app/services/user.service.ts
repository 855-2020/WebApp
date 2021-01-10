import { AuthService } from 'src/app/auth/auth.service';
import { User } from './../models/User';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { BehaviorSubject } from 'rxjs';
import * as _ from 'lodash';
import { Role } from '../models/Role';

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

  addRolesToUser(userId: number, roleIds: number[]): Promise<any> {
    return new Promise((resolve, reject) => {
      this.http.post(`${environment.apiUrl}/users/${userId}/add_roles`, roleIds, {
        headers: {
          ...this.auth.getHeaders(),
        }
      }).toPromise().then(res => {
        console.log('Finished adding roles');
        resolve(res);
      }).catch(err => {
        console.error('Error adding roles', err);
        reject(err);
      });
    });
  }

  changeCurrentUserPassword(id: number, current_password: string, new_password: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this.http.post(`${environment.apiUrl}/users/me/update_password`, { current_password, new_password }, {
        headers: {
          ...this.auth.getHeaders(),
        }
      }).toPromise().then(res => {
        console.log('Finished changing password');
        resolve(res);
      }).catch(err => {
        console.error('Error changing password', err);
        reject(err);
      });
    });
  }

  changeUserPassword(id: number, new_password: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this.http.post(`${environment.apiUrl}/users/${id}/update_password`, { current_password: '', new_password}, {
        headers: {
          ...this.auth.getHeaders(),
        }
      }).toPromise().then(res => {
        console.log('Finished changing password');
        resolve(res);
      }).catch(err => {
        console.error('Error changing password', err);
        reject(err);
      });
    });
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

  editUser(user: User | { id: number, roles: Role[] }): Promise<any> {
    return new Promise((resolve, reject) => {
      this.http.put(`${environment.apiUrl}/users/${user.id}/update`, user, {
        headers: {
          ...this.auth.getHeaders(),
        }
      }).toPromise().then(res => {
        console.log('Finished editing user');
        resolve(res);
      }).catch(err => {
        console.error('Error editing user', err);
        reject(err);
      });
    });
  }

  editCurrentUser(user: User): Promise<any> {
    return new Promise((resolve, reject) => {
      this.http.put(`${environment.apiUrl}/users/me/update`, user, {
        headers: {
          ...this.auth.getHeaders(),
        }
      }).toPromise().then(res => {
        console.log('Finished editing user');
        resolve(res);
      }).catch(err => {
        console.error('Error editing user', err);
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
        console.error('Error getting current user', err);
        reject(err);
      });
    });
  }

  getUser(id: number): Promise<User> {
    return new Promise((resolve, reject) => {
      this.http.get(`${environment.apiUrl}/users/${id}/details`, {
        headers: {
          ...this.auth.getHeaders(),
        }
      }).toPromise().then(res => {
        console.log('Finished getting user');
        resolve(res as User);
      }).catch(err => {
        console.error('Error getting user', err);
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
        console.log('Finished getting users');
        resolve(res as User[]);
      }).catch(err => {
        console.error('Error getting users', err);
        reject(err);
      });
    });
  }

  logout(): void {
    this.auth.logout();
    this.currentUser.next(null);
  }

  removeRolesFromUser(userId: number, roleIds: number[]): Promise<any> {
    return new Promise((resolve, reject) => {
      this.http.post(`${environment.apiUrl}/users/${userId}/remove_roles`, roleIds, {
        headers: {
          ...this.auth.getHeaders(),
        }
      }).toPromise().then(res => {
        console.log('Finished removing roles');
        resolve(res);
      }).catch(err => {
        console.error('Error removing roles', err);
        reject(err);
      });
    });
  }

}
