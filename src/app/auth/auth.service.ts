import { UserService } from './../services/user.service';
import { User } from './../models/User';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  user: BehaviorSubject<User> = new BehaviorSubject<User>(null);
  private _accessToken: string = null;
  private _tokenType: string = null;

  constructor(
    private http: HttpClient,
    private userService: UserService,
  ) {
    this.user.next(null);
  }

  login(username: string, password: string): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.http.post(
        `${environment.apiUrl}/login`,
        { username, password },
        { headers: {
          'Content-Type':  'application/x-www-form-urlencoded'
        }}
      ).toPromise().then(res => {
        console.log(res);

        // this.userService.getCurrentUser();

        resolve();
      }).catch(err => {
        console.error('Error creating user', err);
        reject(err);
      });
    })
  }

  logout(): void {
    this.user.next(null);
  }
}
