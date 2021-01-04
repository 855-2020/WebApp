import { BreakpointObserver } from '@angular/cdk/layout';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

interface NavItem {
  text: string;
  link: string;
  linkType: 'external' | 'route';
  icon: string;
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
  isAdmin = true;

  user = null;

  constructor(
    private breakpointObserver: BreakpointObserver,
  ) {
    this.layoutSubscription = breakpointObserver.observe('(max-width: 768px)').subscribe(result => {
      this.layoutMatches = result.matches;
    });
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    if (this.layoutSubscription) { this.layoutSubscription.unsubscribe(); }
  }

  signOut(): void {

  }

}
