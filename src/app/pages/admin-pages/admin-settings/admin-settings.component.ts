import { AlertDialogComponent } from './../../../components/alert-dialog/alert-dialog.component';
import { Component, OnInit } from '@angular/core';
import { Role } from 'src/app/models/Role';
import { RolesService } from 'src/app/services/roles.service';
import * as _ from 'lodash';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-admin-settings',
  templateUrl: './admin-settings.component.html',
  styleUrls: ['./admin-settings.component.scss']
})
export class AdminSettingsComponent implements OnInit {

  constructor(
    private rolesService: RolesService,
    private snackbar: MatSnackBar,
    private dialog: MatDialog,
  ) { }

  roles: Role[] = [];
  isLoadingRoles = true;
  roleFilter = '';
  filteredRoles: Role[] = [];

  isAddingRole = false;
  newRole: Role = {
    id: -1,
    name: '',
    description: ''
  }

  editing = {};

  ngOnInit(): void {
    this.getRoles();
  }

  getRoles(): void {
    this.isLoadingRoles = true;
    this.rolesService.getRoles().then(roles => {
      this.roles = _.sortBy([
        ...roles,
        { id: -1, name: 'guest', description: 'The default role. This role is the one that is setted to the users without any custom role.' }
      ], ['name']);


      this.editing = {};

      this.roles.forEach(r => {
        this.editing[r.id] = {
          enabled: false,
          processing: false,
          description: r.description,
        }
      });

      this.filterRoles();

      this.isLoadingRoles = false;
    }).catch(err => {
      console.error('Error getting roles');
      this.snackbar.open('Error getting roles', 'OK', {
        duration: 2000
      });
      this.isLoadingRoles = false;
    })
  }

  filterRoles(): void {
    if (this.roleFilter.trim()) {
      this.filteredRoles = _.filter(this.roles, r => r.name?.toUpperCase().indexOf(this.roleFilter.trim().toUpperCase()) >= 0);
    } else {
      this.filteredRoles = this.roles;
    }
  }

  clearRolesFilter(): void {
    this.roleFilter = '';
    this.getRoles();
  }

  clearNewRole(): void {
    this.isAddingRole = false;
    this.newRole = {
      id: -1,
      name: '',
      description: ''
    }
  }

  addRole(): void {
    this.isLoadingRoles = true;

    this.rolesService.createRole({ ...this.newRole, name: this.newRole.name.replace(/\s/g, '_')}).then(() => {
      this.snackbar.open('New role was saved', 'OK', {
        duration: 2000
      });

      this.getRoles();

      this.clearNewRole();
    }).catch(err => {
      console.error('Error saving new role', err);
      this.snackbar.open('Error saving new role. Try again.', 'OK', {
        duration: 2500
      });
      this.isLoadingRoles = false;
    });
  }

  deleteRole(id: number, name: string): void {
    const confirmSubs = this.dialog.open(AlertDialogComponent, {
      data: {
        alertTitle: 'Confirm',
        alertDescription: `Are you sure that you want to delete role <strong>${name}</strong>?`
      }
    }).afterClosed().subscribe(res => {
      if (res) {

        this.rolesService.deleteRole(id).then(() => {
          this.snackbar.open('Role was deleted', 'OK', {
            duration: 2000
          });

          this.getRoles();
        }).catch(err => {
          console.error('Error deleting role', err);
          this.snackbar.open('Error deleting role. Try again.', 'OK', {
            duration: 2500
          });
          this.isLoadingRoles = false;
        });
      }

      if (confirmSubs) {
        confirmSubs.unsubscribe();
      }
    })
  }

  cancelEdit(id: number): void {
    this.editing[id] = {
      enabled: false,
      processing: false,
      description: _.find(this.roles, ['id', id])?.description || '',
    };
  }

  editRole(id: number): void {
    this.editing[id].processing = true;

    this.rolesService.editRole(id, { description: this.editing[id].description }).then(() => {
      this.snackbar.open('Role was saved', 'OK', {
        duration: 2000
      });

      this.editing[id].processing = false;

      this.getRoles();
    }).catch(err => {
      console.error('Error saving role', err);
      this.snackbar.open('Error saving role. Try again.', 'OK', {
        duration: 2500
      });
      this.isLoadingRoles = false;
    });
  }
}
