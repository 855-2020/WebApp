import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService implements OnInit {

  private _accessToken: string = null;
  private _tokenType: string = null;

  constructor(
    private http: HttpClient,
  ) {
  }

  ngOnInit(): void {
  }

  getHeaders() {
    return {
      'Authorization': `${this._tokenType} ${this._accessToken}`
    }
  }

  getTokenFromStorage(): void {
    this._accessToken = localStorage.getItem('accessToken');
    this._tokenType = localStorage.getItem('tokenType');
  }

  isAuthenticated(): boolean {
    return !!this._tokenType && !!this._accessToken;
  }

  login(username: string, password: string): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      const body = new HttpParams()
        .set('username', username)
        .set('password', password);

      this.http.post(
        `${environment.apiUrl}/login`,
        body,
        { headers: {
          'Content-Type':  'application/x-www-form-urlencoded'
        }}
      ).toPromise().then((res: any) => {
        this._accessToken = res.access_token;
        this._tokenType = res.token_type;

        localStorage.setItem('accessToken', res.access_token);
        localStorage.setItem('tokenType', res.token_type);

        resolve();
      }).catch(err => {
        console.error('Error creating user', err);
        reject(err);
      });
    })
  }

  logout(): void {
    this._accessToken = null;
    this._tokenType = null;
    localStorage.clear();
  }
}
