import { AuthService } from 'src/app/auth/auth.service';
import { UserService } from 'src/app/services/user.service';
import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
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
          if (currentUser) {
            resolve(true);
          } else {
            this.router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
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
    })
  }

}
