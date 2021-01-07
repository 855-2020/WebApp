import { Component, OnInit } from '@angular/core';
import { AuthService } from './auth/auth.service';
import { UserService } from './services/user.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'web-app';

  constructor(
    private auth: AuthService,
    private userService: UserService,
  ) {}

  ngOnInit(): void {
    this.auth.getTokenFromStorage();
    console.log(this.auth.getHeaders());

    this.userService.getCurrentUser();
  }
}
