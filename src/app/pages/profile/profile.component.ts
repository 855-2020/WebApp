import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  profileFormGroup: FormGroup;
  passwordFormGroup: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
  ) { }

  ngOnInit(): void {
    //TODO GET USER

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
  }

  saveChanges(): void {
    //TODO 
  }

  changePassword(): void {
    //TODO 
  }
}
