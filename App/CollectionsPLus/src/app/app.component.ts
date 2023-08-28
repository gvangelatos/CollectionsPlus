import { Component, OnDestroy, OnInit } from '@angular/core';
import { DarkModeService } from './services/dark-mode/dark-mode.service';
import { AuthService } from './services/auth/auth.service';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<boolean>();
  private previousAuthState: boolean = false;
  constructor(
    private darkModeService: DarkModeService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    if (localStorage.getItem('darkMode')) {
      this.darkModeService.isDarkMode =
        localStorage.getItem('darkMode') === 'true';
    } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      this.darkModeService.isDarkMode = true;
    } else {
      this.darkModeService.isDarkMode = false;
    }
    this.authService.userIsAuthenticated
      .pipe(takeUntil(this.destroy$))
      .subscribe((isAuth) => {
        if (!isAuth && this.previousAuthState !== isAuth) {
          this.router.navigateByUrl('/auth');
        }
        this.previousAuthState = isAuth;
      });
  }

  onLogout() {
    this.authService.logOut();
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
