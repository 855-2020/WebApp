import { Component, OnInit } from '@angular/core';

import { AppInfo } from 'src/config/app-info';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
// import { AuthService } from 'src/app/auth/auth.service';
import { Router } from '@angular/router';
import { MASKS, NgBrazilValidators } from 'ng-brazil';
import { MatDialog } from '@angular/material/dialog';
import { AlertDialogComponent } from 'src/app/components/alert-dialog/alert-dialog.component';
import { UserService } from './../../services/user.service';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {
  public MASKS = MASKS;

  termsOfService = AppInfo.termsOfServiceLink;
  privacyPolicy = AppInfo.privacyPolicyLink;

  createUserFormGroup: FormGroup;

  constructor(
    private auth: AuthService,
    private router: Router,
    private formBuilder: FormBuilder,
    private dialog: MatDialog,
    private userService: UserService,
  ) { }

  ngOnInit(): void {
    if (this.auth.isAuthenticated()) {
      this.router.navigate(['/']);
    }

    const passwordMatchValidator = (formGroup: FormGroup): void => {
      const error = formGroup.get('passwordCtrl').value === formGroup.get('confirmCtrl').value ? null : { 'mismatch': true };
      formGroup.get('confirmCtrl').setErrors(error);
    }

    this.createUserFormGroup = this.formBuilder.group({
      firstNameCtrl: new FormControl('', [Validators.required]),
      lastNameCtrl: new FormControl('', [Validators.required]),
      usernameCtrl: new FormControl('', [Validators.required]),
      emailCtrl: new FormControl('', [Validators.required, Validators.email]),
      institutionCtrl: new FormControl('', []),
      passwordCtrl: new FormControl('', [Validators.required, Validators.minLength(6), Validators.maxLength(128)]),
      confirmCtrl: new FormControl('', [Validators.required, Validators.minLength(6), Validators.maxLength(128)]),
      termsCtrl: new FormControl(false, [Validators.required])
    }, { validator: passwordMatchValidator });

  }

  createUser(): void {
    if(this.createUserFormGroup.valid) {
      this.userService.createUser({
        firstname: (this.createUserFormGroup.get('firstNameCtrl').value as string).trim().toUpperCase(),
        lastname: (this.createUserFormGroup.get('lastNameCtrl').value as string).trim().toUpperCase(),
        username: (this.createUserFormGroup.get('usernameCtrl').value as string).trim(),
        email: (this.createUserFormGroup.get('emailCtrl').value as string).trim().toLowerCase(),
        institution: (this.createUserFormGroup.get('institutionCtrl').value as string).trim(),
      }, this.createUserFormGroup.get('passwordCtrl').value).then(res => {
        console.log(res);
        this.auth.login(
          (this.createUserFormGroup.get('usernameCtrl').value as string).trim(),
          this.createUserFormGroup.get('passwordCtrl').value
        ).then(() => {
          this.router.navigate(['/account']);
        }).catch((err) => {
          console.error(err);
          this.router.navigate(['/login']);
        })
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
          })
        }
      });
    }
  }

}
