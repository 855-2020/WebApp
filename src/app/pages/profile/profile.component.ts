import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { User } from 'src/app/models/User';
import { UserService } from 'src/app/services/user.service';
import { MatDialog } from '@angular/material/dialog';
import { AlertDialogComponent } from 'src/app/components/alert-dialog/alert-dialog.component';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  isLoading = false;

  user: User;
  
  profileFormGroup: FormGroup;
  passwordFormGroup: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private dialog: MatDialog,
    private userService: UserService,
  ) { }

  ngOnInit(): void {
    const passwordMatchValidator = (formGroup: FormGroup): void => {
      const error = formGroup.get('passwordCtrl').value === formGroup.get('confirmCtrl').value ? null : { 'mismatch': true };
      formGroup.get('confirmCtrl').setErrors(error);
    }

    this.profileFormGroup = this.formBuilder.group({
      firstNameCtrl: new FormControl('', [Validators.required]),
      lastNameCtrl: new FormControl('', [Validators.required]),
      usernameCtrl: new FormControl('', [Validators.required]),
      emailCtrl: new FormControl('', [Validators.required, Validators.email]),
      institutionCtrl: new FormControl('', []),
    });

    this.passwordFormGroup = this.formBuilder.group({
      passwordCtrl: new FormControl('', [Validators.required, Validators.minLength(6), Validators.maxLength(128)]),
      confirmCtrl: new FormControl('', [Validators.required, Validators.minLength(6), Validators.maxLength(128)]),
      oldPasswordCtrl: new FormControl('', [Validators.required]),
    }, { validator: passwordMatchValidator });

    this.getUserData();

  }

  fillForm(): void {
    const user = this.user;

    this.profileFormGroup.controls.firstNameCtrl.setValue(user.firstname || '');
    this.profileFormGroup.controls.lastNameCtrl.setValue(user.lastname || '');
    this.profileFormGroup.controls.usernameCtrl.setValue(user.username || '');
    this.profileFormGroup.controls.emailCtrl.setValue(user.email || '');
    this.profileFormGroup.controls.institutionCtrl.setValue(user.institution || '');

    this.profileFormGroup.controls.usernameCtrl.disable();
  }

  getUserData(): void {
    this.isLoading = true;

    this.userService.getCurrentUser().then(user => {
      this.user = user;

      this.fillForm();

      this.isLoading = false;
    }).catch(err => {
      console.error('Error getting user', err);
      this.isLoading = false;
    });

  }
  
  editUser(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      if(this.profileFormGroup.valid) {
        const data = {
          id: this.user.id,
          firstname: (this.profileFormGroup.get('firstNameCtrl').value as string).trim().toUpperCase(),
          lastname: (this.profileFormGroup.get('lastNameCtrl').value as string).trim().toUpperCase(),
          username: (this.profileFormGroup.get('usernameCtrl').value as string).trim(),
          email: (this.profileFormGroup.get('emailCtrl').value as string).trim().toLowerCase(),
          institution: (this.profileFormGroup.get('institutionCtrl').value as string || '').trim(),
        }

        Promise.all([
          this.userService.editCurrentUser(data),
        ]).then(res => {
          this.getUserData();
          this.dialog.open(AlertDialogComponent, {
            maxWidth: '600px',
            data: {
              alertTitle: 'Success',
              alertDescription: 'Your profile has been succesfully updated',
              isOnlyConfirm: true
            }
          });
          resolve();
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
                alertDescription: 'Error editing user, try again later.',
                isOnlyConfirm: true
              }
            });
          }

          reject(err);
        });
      }
    });
  }

  changePassword(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      const current_password = this.profileFormGroup.controls.passwordCtrl.value;
      const new_password =  this.profileFormGroup.controls.oldPasswordCtrl.value;

      if (current_password && new_password ) {
        this.userService.changeCurrentUserPassword(this.user.id, current_password, new_password).then(res => {
          this.dialog.open(AlertDialogComponent, {
            maxWidth: '600px',
            data: {
              alertTitle: 'Success',
              alertDescription: 'Your password has been succesfully updated',
              isOnlyConfirm: true
            }
          });
          resolve();
        }).catch(err => {
          console.error(err);
          this.dialog.open(AlertDialogComponent, {
            maxWidth: '600px',
            data: {
              alertTitle: 'Error',
              alertDescription: 'Error changing password, try again later.',
              isOnlyConfirm: true
            }
          });
          reject(err);
        });
      } else {
        resolve();
      }
    });
  }

}
