import { SortDirection } from './../models/Common';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AdminUsersService {

  constructor(
    private http: HttpClient,
  ) { }

  searchUsers({
    filterField,
    filterValue,
    orderField = 'name',
    orderDirection = SortDirection.asc,
    pageSize = 25,
    page = 0,
  }: {
    filterField?: string;
    filterValue?: string;
    orderField?: string;
    orderDirection?: SortDirection;
    pageSize?: number;
    page: number;
  }) {
    console.log(filterField, filterValue, );
    return new Promise((resolve, reject) => {
      // const params = `filterField=${filterField}&filterValue=${filterValue}&orderField=${orderField}&orderDirection=${orderDirection}&page=${page}&pageSize=${pageSize}`
      const params = ``;

      this.http.get(
        `${environment.apiUrl}/users/search?${params}`,
        { responseType: 'json'/* , headers: this.authService.getHeaders() */ }
      ).toPromise().then(res => {
        console.log(res);

        resolve(res);
      }).catch(err => {
        console.error('Error getting users.', err);
        reject(err);
      });
    });
  }

}
