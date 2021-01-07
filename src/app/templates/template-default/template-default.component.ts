import { UserService } from 'src/app/services/user.service';
import { BreakpointObserver } from '@angular/cdk/layout';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { User } from 'src/app/models/User';
import { Router } from '@angular/router';
import * as _ from 'lodash';

interface NavItem {
  text: string;
  link: string;
  linkType: 'external' | 'route';
  icon: string;
  logged?: boolean;
}

@Component({
  selector: 'app-template-default',
  templateUrl: './template-default.component.html',
  styleUrls: ['./template-default.component.scss']
})
export class TemplateDefaultComponent implements OnInit, OnDestroy {

  navLinks: NavItem[] = [
    {
      text: 'Home',
      link: '/',
      linkType: 'route',
      icon: 'home',
    },
    {
      text: 'Simplified model',
      link: '/simplified',
      linkType: 'route',
      icon: 'model_training',
      logged: true,
    },
  ];

  adminNavLinks: NavItem[] = [
    {
      text: 'Users',
      link: '/admin/users',
      linkType: 'route',
      icon: 'people_alt',
    },
    {
      text: 'Models',
      link: '/admin/models',
      linkType: 'route',
      icon: 'table_chart',
    },
    {
      text: 'Settings',
      link: '/admin/settings',
      linkType: 'route',
      icon: 'settings',
    },
  ];

  loading = false;
  layoutMatches = false;
  layoutSubscription: Subscription;
  isOpened = false;

  isLogged = false;
  isAdmin = false;

  user: User = null;
  userSubscription: Subscription;

  constructor(
    private breakpointObserver: BreakpointObserver,
    private userService: UserService,
    private router: Router,
  ) {
    this.layoutSubscription = breakpointObserver.observe('(max-width: 768px)').subscribe(result => {
      this.layoutMatches = result.matches;
    });
  }

  ngOnInit(): void {
    this.userSubscription = this.userService.currentUser.subscribe(user => {
      this.user = user;

      if (user) {
        this.isLogged = true;
        this.isAdmin = !!_.find(user.roles, ['name', 'admin']);
      } else {
        this.isLogged = false;
        this.isAdmin = false;
      }

    });
  }

  ngOnDestroy(): void {
    if (this.layoutSubscription) { this.layoutSubscription.unsubscribe(); }
    if (this.userSubscription) { this.userSubscription.unsubscribe(); }
  }

  signOut(): void {
    this.userService.logout();
    this.router.navigate(['/login']);
  }

}
