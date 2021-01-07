import { RolesService } from './../../../services/roles.service';
import { Component, OnInit } from '@angular/core';
import { Role } from 'src/app/models/Role';

@Component({
  selector: 'app-admin-settings',
  templateUrl: './admin-settings.component.html',
  styleUrls: ['./admin-settings.component.scss']
})
export class AdminSettingsComponent implements OnInit {

  constructor(
    private rolesService: RolesService,
  ) { }

  roles: Role[];
  loadingRoles = true;

  ngOnInit(): void {
    this.getRoles();
  }

  getRoles(): void {
    this.loadingRoles = true;
    this.rolesService.getRoles().then(roles => {
      this.roles = roles;
      console.log(roles);
      this.loadingRoles = false;
    }).catch(err => {
      console.error('Error getting roles');
      this.loadingRoles = false;
    })
  }
}
