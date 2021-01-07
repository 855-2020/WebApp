import { Model } from './../../../models/Model';
import { ModelsService } from './../../../services/models.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Role } from 'src/app/models/Role';
import { RolesService } from 'src/app/services/roles.service';
import * as _ from 'lodash';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'app-admin-models',
  templateUrl: './admin-models.component.html',
  styleUrls: ['./admin-models.component.scss']
})
export class AdminModelsComponent implements OnInit {

  readonly filterFields = [
    {
      name: 'name',
      label: 'Name'
    },
    {
      name: 'role',
      label: 'Role'
    }
  ];

  models: Model[];
  roles: Role[] = [];
  isLoading = true;

  selectedFilter = this.filterFields[0];
  filterValue = '';
  filterRoles = [];

  displayedColumns: string[] = ['id', 'name', 'roles', 'actions'];
  modelsDataSource: MatTableDataSource<Model>;

  @ViewChild(MatSort, { static: true }) sort: MatSort;

  constructor(
    private modelsService: ModelsService,
    private rolesService: RolesService,
    private snackbar: MatSnackBar,
  ) { }

  ngOnInit(): void {
    this.applyFilter();
  }

  applyFilter(): void {
    this.isLoading = true;

    this.getRoles();
    this.modelsService.getModels().then(models => {
      this.models = models;
      this.modelsDataSource = new MatTableDataSource(this.filter());
      this.modelsDataSource.sort = this.sort;
    }).catch(err => {
      console.error('Error getting models', err);
      this.snackbar.open('Error getting models', 'OK', {
        duration: 2000
      });
    }).finally(() => {
      this.isLoading = false;
    })
  }

  filter(): any[] {
    if (!this.filterValue && !this.filterRoles?.length) {
      return this.models;
    }

    if (this.selectedFilter.name === 'name') {
      return _.filter(this.models, m => `${m.name}`.toUpperCase().indexOf(this.filterValue.toUpperCase()) >= 0);
    } else if (this.selectedFilter.name === 'role') {
      return _.filter(this.models, m => {
        const roleIds = m.roles.map(r => r.id);

        if (this.filterRoles.indexOf(-1) >= 0 && !m.roles?.length) {
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
