import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import jwt_decode from 'jwt-decode';
import { BehaviorSubject, from, Observable, of } from 'rxjs';
import { catchError, switchMap, take, tap } from 'rxjs/operators';
import { LogService } from '../log.service';
import { DatabaseService } from './database.service';

const ACCESS_TOKEN_KEY = 'access-token';
const REFRESH_TOKEN_KEY = 'refresh-token'

@Injectable({
  providedIn: 'root'
})

export class AuthService extends DatabaseService {
  public isAuthenticated = new BehaviorSubject<boolean>(null);
  public currentAccessToken = null;
  public currentRefreshToken = null;

  constructor(
    private router: Router,
    private storage: Storage,
    protected httpClient: HttpClient,
    protected alertCtrl: AlertController,
    protected logger: LogService,
  ) {
    super(httpClient, alertCtrl, logger);
    console.log('Constructor of AuthService');
    this.loadToken()
  }

  async loadToken() {
    this.logger.log('load access token...');
    await this.storage.create();

    const accessToken = await this.storage.get(ACCESS_TOKEN_KEY);
    if (accessToken) {
      this.currentAccessToken = accessToken;
      this.isAuthenticated.next(true);
      console.log('... is authenticated (says AuthService)')
    } else {
      this.isAuthenticated.next(false);
      console.log('... is not authenticated (says AuthService)')
    }

    const refreshToken = await this.storage.get(REFRESH_TOKEN_KEY);
    if (refreshToken) {
      this.currentRefreshToken = refreshToken;
    }
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
  login(credentials: { username: string, password: string }): Observable<any> {

    if (!credentials.username || !credentials.password) {
      return of(null);
    } else {

      return this.POST('/api/auth/login', { 'username': credentials.username, 'password': credentials.password }).pipe(
        catchError(this.handleError),
        take(1),
        switchMap(token => {
          const accessToken = token['accessToken'];
          const refreshToken = token['refreshToken'];
          this.currentAccessToken = accessToken;
          this.currentRefreshToken = refreshToken;

          const storageAccess = this.storage.set(ACCESS_TOKEN_KEY, accessToken);
          const storageRefresh = this.storage.set(REFRESH_TOKEN_KEY, refreshToken);

          return from(Promise.all([storageAccess, storageRefresh]));
        }),
        tap(_ => {
          this.isAuthenticated.next(true);
        })
      )
    }
  }

  async logout() {
    let token = await this.storage.get(REFRESH_TOKEN_KEY);

    if (!token) {
      this.isAuthenticated.next(false);
      this.router.navigateByUrl('/', { replaceUrl: true });
      return;
    };

    return this.POST(`/api/auth/logout`, { token }).pipe(
      catchError(this.handleError),
      take(1),
      switchMap(_ => {
        const deleteAccess = this.storage.remove(ACCESS_TOKEN_KEY);
        const deleteRefresh = this.storage.remove(REFRESH_TOKEN_KEY);
        return from(Promise.all([deleteAccess, deleteRefresh]));
      }),
      tap(_ => {
        this.isAuthenticated.next(false);
        this.router.navigateByUrl('/', { replaceUrl: true });
      })
    ).subscribe();
  }

  // Load the refresh token from storage
  // then attach it as the header for one specific API call
  getNewAccessToken(): Observable<any> {
    return from(this.storage.get(REFRESH_TOKEN_KEY)).pipe(
      switchMap(token => {
        console.log(token);
        if (token) {
          console.log("refreshToken " + token);
          return this.POST(`/api/auth/token`, { token });
        } else {
          console.log("no refreshToken available");
          // No stored refresh token
          return of(null);
        }
      })
    );
  }

  // Store a new access token
  storeAccessToken(accessToken) {
    this.currentAccessToken = accessToken;
    return from(this.storage.set(ACCESS_TOKEN_KEY, accessToken));
  }

  getAccessToken(): Object {
    if (this.currentAccessToken) {
      return jwt_decode(this.currentAccessToken);
    } else {
      return {};
    }
  }
  getRefresehToken(): Object {
    if (this.currentRefreshToken) {
      return jwt_decode(this.currentRefreshToken);
    } else {
      return {};
    }
  }
}
