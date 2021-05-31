import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { AuthService } from '../services/datasource/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router, private alertCtrl: AlertController) {

  }
  canActivate(): Observable<boolean> {
    return this.authService.user.pipe(
      take(1),
      map(user => {
        console.log('in canActivete user', user);
        if (!user) {
          this.alertCtrl.create({
            header: 'Unauthorized',
            message: 'You are not allowed to access this page',
            buttons: ['OK']
          }).then(alert => alert.present());
          return false;
        } else {
          return true;
        }
      })
    );
  }

}
