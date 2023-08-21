import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth/auth.service';

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
    private loadingCtrl: LoadingController
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

    if (this.isLogin) {
      // send req to login
    } else {
      // send req to signup
    }
    form.reset();
  }

  wobble() {
    this.wobbling = true;
    setTimeout(() => {
      this.wobbling = false;
    }, 400);
  }

  onLogin() {
    this.isLoading = true;
    this.authService.login();
    this.loadingCtrl
      .create({ keyboardClose: true, message: 'Logging In...' })
      .then((loadingEl) => {
        loadingEl.present();
        setTimeout(() => {
          this.isLoading = false;
          loadingEl.dismiss();
          this.router.navigateByUrl('/collections');
        }, 2000);
      });

    // this.router.navigateByUrl('/places/tabs/discover');
  }
}
