import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
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
        console.error('Error getting sectors', err);
        reject(err);
      });
    });
  }

}
