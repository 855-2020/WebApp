import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import * as _ from 'lodash';
import { environment } from 'src/environments/environment';
import { AuthService } from '../auth/auth.service';
import { Role } from '../models/Role';

@Injectable({
  providedIn: 'root'
})
export class RolesService {

  constructor(
    private http: HttpClient,
    private auth: AuthService,
  ) { }

  createRole(role: Role): Promise<Role> {
    return new Promise((resolve, reject) => {
      this.http.post(`${environment.apiUrl}/roles/create`, _.omit(role, ['id']), {
        headers: {
          ...this.auth.getHeaders(),
        }
      }).toPromise().then(res => {
        console.log('Finished creating role');
        resolve(res as Role);
      }).catch(err => {
        console.error('Error creating role', err);
        reject(err);
      });
    });
  }

  deleteRole(id: number): Promise<void> {
    return new Promise((resolve, reject) => {
      this.http.delete(`${environment.apiUrl}/roles/${id}`, {
        headers: {
          ...this.auth.getHeaders(),
        }
      }).toPromise().then(res => {
        console.log('Finished deleting role');
        resolve();
      }).catch(err => {
        console.error('Error deleting role', err);
        reject(err);
      });
    });
  }

  editRole(id: number, data: any): Promise<void> {
    return new Promise((resolve, reject) => {
      this.http.put(`${environment.apiUrl}/roles/${id}`, data, {
        headers: {
          ...this.auth.getHeaders(),
        }
      }).toPromise().then(res => {
        console.log('Finished editing role');
        resolve();
      }).catch(err => {
        console.error('Error editing role', err);
        reject(err);
      });
    });
  }

  getRoles(): Promise<Role[]> {
    return new Promise((resolve, reject) => {
      this.http.get(`${environment.apiUrl}/roles/list`, {
        headers: {
          ...this.auth.getHeaders(),
        }
      }).toPromise().then(res => {
        console.log('Finished getting roles');
        resolve(res as Role[]);
      }).catch(err => {
        console.error('Error getting roles', err);
        reject(err);
      });
    });
  }

}
