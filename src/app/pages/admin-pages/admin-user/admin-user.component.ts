import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { take } from 'rxjs/operators';
import { Role } from 'src/app/models/Role';
import { User } from 'src/app/models/User';
import { RolesService } from 'src/app/services/roles.service';
import { UserService } from 'src/app/services/user.service';
import * as _ from 'lodash';
import { MatDialog } from '@angular/material/dialog';
import { AlertDialogComponent } from 'src/app/components/alert-dialog/alert-dialog.component';

@Component({
  selector: 'app-admin-user',
  templateUrl: './admin-user.component.html',
  styleUrls: ['./admin-user.component.scss']
})
export class AdminUserComponent implements OnInit {

  isEdit = false;
  isLoading = true;
  userId: number;

  roles: Role[];
  user: User;

  userFormGroup: FormGroup;

  constructor(
    private dialog: MatDialog,
    private formBuilder: FormBuilder,
    private rolesService: RolesService,
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService,
  ) { }

  async ngOnInit() {
    const params = await this.route.params.pipe(take(1)).toPromise();
    this.userId = params.userId;

    this.userFormGroup = this.formBuilder.group({
      firstNameCtrl: new FormControl('', [Validators.required]),
      lastNameCtrl: new FormControl('', [Validators.required]),
      usernameCtrl: new FormControl('', [Validators.required]),
      emailCtrl: new FormControl('', [Validators.required, Validators.email]),
      institutionCtrl: new FormControl(),
      rolesCtrl: new FormControl(),
      passwordCtrl: new FormControl('', [Validators.minLength(6), Validators.maxLength(128)]),
    });

    this.getRoles();

    if (params.userId) {
      this.isEdit = true;
      this.getUserData(params.userId);
    } else {
      this.isLoading = false;
    }

  }

  getUserData(id: number): void {
    this.userService.getUser(id).then(user => {
      this.user = user;

      this.fillForm();

      this.isLoading = false;
    }).catch(err => {
      console.error('Error getting user', err);
      this.isLoading = false;
    });
  }

  getRoles(): void {
    this.rolesService.getRoles().then(roles => {
      this.roles = _.sortBy(roles, ['name']);
    }).catch(err => {
      console.error('Error getting roles', err);
      this.roles = [];
    });
  }

  fillForm(): void {
    const user = this.user;

    this.userFormGroup.controls.firstNameCtrl.setValue(user.firstname || '');
    this.userFormGroup.controls.lastNameCtrl.setValue(user.lastname || '');
    this.userFormGroup.controls.usernameCtrl.setValue(user.username || '');
    this.userFormGroup.controls.emailCtrl.setValue(user.email || '');
    this.userFormGroup.controls.institutionCtrl.setValue(user.institution || '');
    this.userFormGroup.controls.rolesCtrl.setValue(user.roles?.map(r => r.id));
    this.userFormGroup.controls.passwordCtrl.setValue('');
  }

  editUser(): void {

  }

  createUser(): void {
    if(this.userFormGroup.valid) {
      this.userService.createUser({
        firstname: (this.userFormGroup.get('firstNameCtrl').value as string).trim().toUpperCase(),
        lastname: (this.userFormGroup.get('lastNameCtrl').value as string).trim().toUpperCase(),
        username: (this.userFormGroup.get('usernameCtrl').value as string).trim(),
        email: (this.userFormGroup.get('emailCtrl').value as string).trim().toLowerCase(),
        institution: (this.userFormGroup.get('institutionCtrl').value as string || '').trim(),
        agreed_terms: false,
      }, this.userFormGroup.get('passwordCtrl').value).then(res => {
        this.router.navigate(['/admin/users']);
      }).catch(err => {
        console.error(err);
        if (err.status === 409) {
          this.dialog.open(AlertDialogComponent, {
            maxWidth: '600px',
            data: {
              alertTitle: 'Already in use',
              alertDescription: err.detail,
              isOnlyConfirm: true
            }
          })
        } else {
          this.dialog.open(AlertDialogComponent, {
            maxWidth: '600px',
            data: {
              alertTitle: 'Error',
              alertDescription: 'Error creating user, try again later.',
              isOnlyConfirm: true
            }
          });
        }
      });
    }
  }
}
