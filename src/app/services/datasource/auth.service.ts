import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { AlertController, Platform } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { BehaviorSubject, from, Observable, of } from 'rxjs';
import { catchError, map, switchMap, take } from 'rxjs/operators';
import { User } from 'src/app/models/user';
import { LogService } from '../log.service';
import { DatabaseService } from './database.service';

const helper = new JwtHelperService();
const TOKEN_KEY = 'access-token';

@Injectable({
  providedIn: 'root'
})

export class AuthService extends DatabaseService {
  public user: Observable<User>;
  private userData = new BehaviorSubject(null);

  constructor(
    private plt: Platform,
    private router: Router,
    private storage: Storage,
    protected httpClient: HttpClient,
    protected alertCtrl: AlertController,
    protected logger: LogService
  ) {
    super(httpClient, alertCtrl, logger);
    this.loadStoredToken();
  }

  loadStoredToken() {
    this.logger.log('load token');
    let pltformObs = from(this.plt.ready());
    this.user = pltformObs.pipe(
      switchMap(() => {
        return from(this.storage.get(TOKEN_KEY));
      }),
      map(token => {
        console.log('Token from storage', token);
        if (token) {
          let decoded = helper.decodeToken(token);
          console.log('decoded token', decoded);
          this.userData.next(decoded)
        } else {
          return null;
        }
      })
    );
  }

  /**
    {
      "accessToken": "eyJhbJ9.eyJuYW1lIjoibm4OTg0Mn0.kgR2dN1VsZ_1Vd8\",",
      "refreshToken": "eyIjshJ9.eyJOOksW1lIjdasdihg0Mn0.kgR2dNsda2d8\","
    }
   * 
   * @param credentials 
   * @returns 
   */
  login(credentials: { user: string, password: string }): Observable<any> {
    if (!credentials.user || !credentials.password) {
      return of(null);
    } else {
      return this.POST('/auth/login', { 'name': credentials.user, 'password': credentials.password }).pipe(
        catchError(super.handleError),
        take(1),
        map(res => {
          return res['accessToken'];
        }),
        switchMap(token => {
          let decoded = helper.decodeToken(token);
          console.log('login decoded: ', decoded);
          this.userData.next(decoded);
          let storageObs = from(this.storage.set(TOKEN_KEY, token));
          return storageObs;
        })
      )
    }
  }

  getUser() {
    return this.userData.getValue();
  }

  logout() {
    this.storage.remove(TOKEN_KEY).then(() => {
      this.router.navigateByUrl('/');
      this.userData.next(null);
    });
  }
}
