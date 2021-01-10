import { Component, OnInit } from '@angular/core';
import { FormControl, Validators, FormGroup } from '@angular/forms';
// import { AuthService } from 'src/app/auth/auth.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { AlertDialogComponent } from 'src/app/components/alert-dialog/alert-dialog.component';
import { AuthService } from 'src/app/auth/auth.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  loginFormGroup: FormGroup;

  isForgotPassword = false;

  constructor(
    private auth: AuthService,
    private router: Router,
    private dialog: MatDialog,
    private userService: UserService,
  ) { }

  ngOnInit(): void {
    if (this.auth.isAuthenticated()) {
      this.router.navigate(['/']);
    }

    this.loginFormGroup = new FormGroup({
      email: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required]),
    });
  }

  forgotPassword(): void {
    this.isForgotPassword = true;
  }

  goToLogin(): void {
    this.isForgotPassword = false;
  }

  login(): void {
    this.auth.login(
      this.loginFormGroup.controls.email.value.trim().toLowerCase(),
      this.loginFormGroup.controls.password.value
    ).then(() => {
      this.userService.getCurrentUser().then(user => {
        this.router.navigate(['/models']);
      }).catch(err => {
        this.userService.logout();

        this.dialog.open(AlertDialogComponent, {
          maxWidth: '600px',
          data: {
            alertTitle: 'Error',
            alertDescription: 'Error while signing in. Try again later.',
            isOnlyConfirm: true
          }
        });
      });
    }).catch(err => {

      // if (err.code === 'auth/user-not-found') {
      //   this.dialog.open(AlertDialogComponent, {
      //     maxWidth: '600px',
      //     data: {
      //       alertTitle: 'Usuário não encontrado',
      //       alertDescription: 'O usuário informado não possui cadastro. Verifique o e-mail digitado.',
      //       isOnlyConfirm: true
      //     }
      //   });
      // } else if (err.code === 'auth/wrong-password') {
      //   this.dialog.open(AlertDialogComponent, {
      //     maxWidth: '600px',
      //     data: {
      //       alertTitle: 'Senha incorreta',
      //       alertDescription: 'A senha informada é incorreta. Tente novamente.',
      //       isOnlyConfirm: true
      //     }
      //   });
      // } else {
        this.dialog.open(AlertDialogComponent, {
          maxWidth: '600px',
          data: {
            alertTitle: 'Error',
            alertDescription: 'Error while signing in. Try again later.',
            isOnlyConfirm: true
          }
        });
      // }
    });
  }

  sendResetPassword(): void {
    // this.authService.sendPasswordResetEmail(this.loginFormGroup.controls.email.value.trim().toLowerCase()).then(() => {
    //   const msgSubscription = this.dialog.open(AlertDialogComponent, {
    //     maxWidth: '600px',
    //     data: {
    //       alertTitle: 'Redefinição enviada!',
    //       alertDescription: 'O e-mail de redefinição foi enviado. Acesse sua caixa de entrada e siga as instruções contidas no e-mail.',
    //       isOnlyConfirm: true
    //     }
    //   }).afterClosed().subscribe(() => {
    //     if (msgSubscription) { msgSubscription.unsubscribe(); }
    //     this.goToLogin();
    //   });
    // }).catch(err => {
    //   this.dialog.open(AlertDialogComponent, {
    //     maxWidth: '600px',
    //     data: {
    //       alertTitle: 'Erro',
    //       alertDescription: 'Ocorreu um erro ao enviar o e-mail de redefinição. Tente novamente mais tarde.',
    //       isOnlyConfirm: true
    //     }
    //   });
    // });
  }

}
