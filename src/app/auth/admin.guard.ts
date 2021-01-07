import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import * as _ from 'lodash';
import { Observable } from 'rxjs';
import { UserService } from '../services/user.service';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {
  constructor(
    private auth: AuthService,
    private router: Router,
    private userService: UserService,
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return new Promise(resolve => {
      if (this.auth.isAuthenticated()) {
        this.userService.getCurrentUser().then(currentUser => {
          if (!currentUser) {
            this.router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
            resolve(false);
          } else if (_.find(currentUser.roles, ['name', 'admin'])) {
            resolve(true);
          } else {
            this.router.navigate(['/home'], { queryParams: { returnUrl: state.url } });
            resolve(false);
          }
        }).catch(err => {
          console.error('Error getting user on auth guard', err);
          resolve(false);
        });
      } else {
        this.router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
        resolve(false);
      }
    });
  }
}
