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

  fillerNav: NavItem[] = [
    {
      text: 'Home',
      link: '/',
      linkType: 'route',
      icon: 'home',
    },
  ];

  loading = false;
  layoutMatches = false;
  layoutSubscription: Subscription;
  isOpened = false;

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

}
