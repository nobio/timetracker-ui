import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { ToastController } from "@ionic/angular";
import { BehaviorSubject, Observable, of, throwError } from "rxjs";
import { catchError, filter, finalize, switchMap, take } from "rxjs/operators";
import { environment } from "src/environments/environment";
import { AuthService } from "../services/datasource/auth.service";

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
    // Used for queued API calls while refreshing tokens
    tokenSubject: BehaviorSubject<string> = new BehaviorSubject<string>(null);
    isRefreshingToken = false;

    constructor(private authService: AuthService, private toastCtrl: ToastController) { }

    // Intercept every HTTP call
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

        // Check if we need additional token logic or not
        if (this.isInBlockedList(request.url)) {
            return next.handle(request);
        } else {
            return next.handle(this.addToken(request)).pipe(
                catchError(err => {
                    if (err instanceof HttpErrorResponse) {
                        switch (err.status) {
                            case 400:
                                return this.handle400Error(err);
                            case 401:
                                return this.handle401Error(request, next);
                            default:
                                return throwError(err);
                        }
                    } else {
                        return throwError(err);
                    }
                })
            );
        }
    }

    // Filter out URLs where you don't want to add the token!
    private isInBlockedList(url: string): Boolean {
        // Example: Filter out our login and logout API call
        if (url == `${environment.baseUrl}/api/auth` || url == `${environment.baseUrl}/api/logout`) {
            return true;
        } else {
            return false;
        }
    }

    // Add our current access token from the service if present
    private addToken(req: HttpRequest<any>) {
        if (this.authService.currentAccessToken) {
            return req.clone({
                headers: req.headers.set('Authorization', `Bearer ${this.authService.currentAccessToken}`)
            });
        } else {
            return req;
        }
    }

    // We are not just authorized, we couldn't refresh token
    // or something else along the caching went wrong!
    private async handle400Error(err) {
        // Potentially check the exact error reason for the 400
        // then log out the user automatically
        const toast = await this.toastCtrl.create({
            message: 'Logged out due to authentication mismatch',
            duration: 2000
        });
        toast.present();
        this.authService.logout();
        return of(null);
    }

    // Indicates our access token is invalid, try to load a new one
    private handle401Error(request: HttpRequest<any>, next: HttpHandler): Observable<any> {
        // Check if another call is already using the refresh logic
        if (!this.isRefreshingToken) {

            // Set to null so other requests will wait
            // until we got a new token!
            this.tokenSubject.next(null);
            this.isRefreshingToken = true;
            this.authService.currentAccessToken = null;

            // First, get a new access token
            return this.authService.getNewAccessToken().pipe(
                switchMap((token: any) => {
                    if (token) {
                        // Store the new token
                        const accessToken = token.accessToken;
                        return this.authService.storeAccessToken(accessToken).pipe(
                            switchMap(_ => {
                                // Use the subject so other calls can continue with the new token
                                this.tokenSubject.next(accessToken);

                                // Perform the initial request again with the new token
                                return next.handle(this.addToken(request));
                            })
                        );
                    } else {
                        // No new token or other problem occurred
                        return of(null);
                    }
                }),
                finalize(() => {
                    // Unblock the token reload logic when everything is done
                    this.isRefreshingToken = false;
                })
            );
        } else {
            // "Queue" other calls while we load a new token
            return this.tokenSubject.pipe(
                filter(token => token !== null),
                take(1),
                switchMap(token => {
                    // Perform the request again now that we got a new token!
                    return next.handle(this.addToken(request));
                })
            );
        }
    }
}