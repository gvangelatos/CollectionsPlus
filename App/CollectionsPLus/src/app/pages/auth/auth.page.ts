import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController, LoadingController } from '@ionic/angular';
import { Observable } from 'rxjs';
import {
  AuthResponseData,
  AuthService,
} from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.page.html',
  styleUrls: ['./auth.page.scss'],
})
export class AuthPage implements OnInit {
  isLoading: boolean = false;
  isLogin: boolean = true;
  wobbling: boolean = false;
  showPassword: boolean = false;
  constructor(
    private authService: AuthService,
    private router: Router,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController
  ) {}

  ngOnInit() {}

  onSwitchMode() {
    this.isLogin = !this.isLogin;
  }

  togglePasswordVisible() {
    this.showPassword = !this.showPassword;
  }

  onSubmit(form: NgForm) {
    // console.log(form);
    if (!form.valid) {
      return;
    }
    const email = form.value.email;
    const pass = form.value.password;
    this.authenticate(email, pass);
    form.reset();
  }

  wobble() {
    this.wobbling = true;
    setTimeout(() => {
      this.wobbling = false;
    }, 400);
  }

  authenticate(email: string, password: string) {
    this.isLoading = true;
    // this.authService.login();
    this.loadingCtrl
      .create({ keyboardClose: true, message: 'Logging In...' })
      .then((loadingEl) => {
        loadingEl.present();
        let authObs: Observable<AuthResponseData>;
        if (this.isLogin) {
          authObs = this.authService.login(email, password);
        } else {
          authObs = this.authService.signUp(email, password);
        }
        authObs.subscribe(
          (resData) => {
            console.log(resData);
            this.isLoading = false;
            loadingEl.dismiss();
            this.router.navigateByUrl('/collections');
          },
          (error) => {
            loadingEl.dismiss();
            this.isLoading = false;
            const errorCode = error.error.error.message;
            let message = 'Could not sign you up, please try again!';
            switch (errorCode) {
              case 'EMAIL_EXISTS':
                message =
                  'The email address is already in use by another account.';
                break;
              case 'OPERATION_NOT_ALLOWED':
                message = 'Password sign-in is disabled for this project.';
                break;
              case 'TOO_MANY_ATTEMPTS_TRY_LATER':
                message =
                  'We have blocked all requests from this device due to unusual activity. Try again later.';
                break;
              case 'USER_DISABLED':
                message =
                  "The user's credential is no longer valid. The user must sign in again.";
                break;
              case 'USER_NOT_FOUND':
                message =
                  'The user corresponding to the refresh token was not found. It is likely the user was deleted.';
                break;
              case 'TOKEN_EXPIRED':
                message =
                  "The user's credential is no longer valid. The user must sign in again.";
                break;
              case 'EMAIL_NOT_FOUND':
                message =
                  'There is no user record corresponding to this identifier. The user may have been deleted.';
                break;
              default:
                break;
            }
            this.showAlert(message);
          }
        );
      });

    // this.router.navigateByUrl('/places/tabs/discover');
  }

  showAlert(message: string) {
    this.alertCtrl
      .create({
        header: 'Authentication Failed!',
        message: message,
        buttons: ['Okay!'],
      })
      .then((alertEl) => alertEl.present());
  }
}
