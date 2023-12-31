import { HttpClient } from '@angular/common/http';
import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, asyncScheduler, from, map, tap } from 'rxjs';
import { User } from 'src/app/models/user-model/user.model';
import { environment } from 'src/environments/environment';
import { Preferences } from '@capacitor/preferences';

export interface AuthResponseData {
  kind: string;
  idToken: string;
  email: string;
  refreshToken: string;
  localId: string;
  expiresIn: string;
  registered?: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService implements OnDestroy {
  private _user: BehaviorSubject<User | null> =
    new BehaviorSubject<User | null>(null);
  private _token: BehaviorSubject<string> = new BehaviorSubject<string>('');
  private activeLogOutTimer: any;

  constructor(private http: HttpClient) {}

  get userIsAuthenticated() {
    return this._user.asObservable().pipe(
      map((user) => {
        if (user) {
          return !!user?.token;
        } else {
          return false;
        }
      })
    );
  }

  get userId() {
    return this._user.asObservable().pipe(
      map((user) => {
        if (user) {
          return user?.id;
        } else {
          return null;
        }
      })
    );
  }

  get token() {
    return this._user.asObservable().pipe(
      map((user) => {
        if (user) {
          return user?.token;
        } else {
          return null;
        }
      })
    );
  }

  login(email: string, password: string) {
    const payLoad = {
      email,
      password,
      returnSecureToken: true,
    };
    return this.http
      .post<AuthResponseData>(
        environment.firebaseLoginUrl + '' + environment.firebaseApiKey,
        payLoad
      )
      .pipe(
        tap((resData) => {
          this.setUserData(resData);
        })
      );
  }

  signUp(email: string, password: string) {
    const payLoad = {
      email,
      password,
      returnSecureToken: true,
    };
    return this.http
      .post<AuthResponseData>(
        environment.firebaseSignUpUrl + '' + environment.firebaseApiKey,
        payLoad
      )
      .pipe(
        tap((resData) => {
          this.setUserData(resData);
        })
      );
  }

  logOut() {
    if (this.activeLogOutTimer) {
      clearTimeout(this.activeLogOutTimer);
    }
    this._user.next(null);
    Preferences.remove({ key: 'authData' });
  }

  private autoLogOut(duration: number) {
    if (this.activeLogOutTimer) {
      clearTimeout(this.activeLogOutTimer);
    }
    this.activeLogOutTimer = setTimeout(() => {
      this.logOut();
    }, duration);
  }

  autoLogin() {
    return from(Preferences.get({ key: 'authData' })).pipe(
      map((storageData) => {
        if (!storageData?.value) {
          return null;
        }
        const parsedData = JSON.parse(storageData.value) as {
          token: string;
          tokenExpirationDate: string;
          userId: string;
          email: string;
        };
        const expirationTime = new Date(parsedData.tokenExpirationDate);
        if (expirationTime <= new Date()) {
          return null;
        }
        const newUser = new User(
          parsedData.userId,
          parsedData.email,
          parsedData.token,
          expirationTime
        );
        return newUser;
      }),
      tap((user) => {
        if (user) {
          this._user.next(user);
          this.autoLogOut(user.tokenDuration);
        }
      }),
      map((user) => {
        return !!user;
      })
    );
  }

  private setUserData(userData: AuthResponseData) {
    const exprationTime = new Date(
      new Date().getTime() + +userData.expiresIn * 1000
    );
    const newUser = new User(
      userData.localId,
      userData.email,
      userData.idToken,
      exprationTime
    );
    this._user.next(newUser);
    this.storeAuthData(
      userData.localId,
      userData.idToken,
      exprationTime.toISOString(),
      userData.email
    );
    this.autoLogOut(newUser.tokenDuration);
  }

  private storeAuthData(
    userId: string,
    token: string,
    tokenExpirationDate: string,
    email: string
  ) {
    const authData = {
      userId,
      token,
      tokenExpirationDate,
      email,
    };
    Preferences.set({
      key: 'authData',
      value: JSON.stringify(authData),
    });
  }

  ngOnDestroy(): void {
    if (this.activeLogOutTimer) {
      clearTimeout(this.activeLogOutTimer);
    }
  }
}
