import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { User } from 'src/app/models/User';
import { UserService } from 'src/app/services/user.service';
import * as _ from 'lodash';
import { RolesService } from 'src/app/services/roles.service';
import { Role } from 'src/app/models/Role';

@Component({
  selector: 'app-admin-users',
  templateUrl: './admin-users.component.html',
  styleUrls: ['./admin-users.component.scss']
})
export class AdminUsersComponent implements OnInit {

  readonly filterFields = [
    {
      name: 'name',
      label: 'Name'
    },
    {
      name: 'email',
      label: 'E-mail'
    },
    // {
    //   name: 'status',
    //   label: 'Status'
    // },
    {
      name: 'role',
      label: 'Role'
    }
  ];

  displayedColumns: string[] = ['name', 'email',/*  'status',  */ 'roles', 'actions'];
  usersDataSource: MatTableDataSource<User>;

  // Filter
  selectedFilter = this.filterFields[0];
  filterValue = '';
  filterRoles = [];

  pageSizeOptions: number[] = [25, 50, 100];


  @ViewChild(MatSort, { static: true }) sort: MatSort;

  isLoading = true;

  users: User[];
  roles: Role[];

  constructor(
    private userService: UserService,
    private rolesService: RolesService,
  ) { }

  ngOnInit(): void {
    this.applyFilter();
  }

  applyFilter(): void {
    this.isLoading = true;

    this.getRoles();
    this.userService.getUsers().then(users => {
      this.users = users;
      this.usersDataSource = new MatTableDataSource(this.filter());
      this.usersDataSource.sort = this.sort;
    }).catch(err => {
      console.error('Cannot get users');
    }).finally(() => {
      this.isLoading = false;
    })
  }

  filter(): User[] {
    if (!this.filterValue && !this.filterRoles?.length) {
      return this.users;
    }

    if (this.selectedFilter.name === 'name') {
      return _.filter(this.users, u => `${u.firstname} ${u.lastname}`.toUpperCase().indexOf(this.filterValue.toUpperCase()) >= 0);
    } else if (this.selectedFilter.name === 'email') {
      return _.filter(this.users, u => u.email.toLowerCase().indexOf(this.filterValue.toLowerCase()) >= 0);
    } else if (this.selectedFilter.name === 'role') {
      return _.filter(this.users, u => {
        const roleIds = u.roles.map(r => r.id);

        if (this.filterRoles.indexOf(-1) >= 0 && !u.roles?.length) {
          return true;
        }

        if (_.intersection(this.filterRoles, roleIds).length > 0) {
          return true;
        } else {
          return false;
        }
      });
    }
  }

  clearFilter(): void {
    this.filterValue = '';
    this.filterRoles = [];
    this.applyFilter();
  }

  getRoles(): void {
    this.rolesService.getRoles().then(roles => {
      this.roles = _.sortBy([
        ...roles,
        { id: -1, name: 'guest' }
      ], ['name']);
    }).catch(err => {
      console.error('Error getting roles');
      this.roles = [];
    });
  }
}
