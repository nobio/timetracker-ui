import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { filter, map, take } from 'rxjs/operators';
import { AuthService } from '../services/datasource/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) { }
  canActivate(): Observable<boolean> {
    return this.authService.isAuthenticated.pipe(
      filter(val => val !== null), // Filter out initial Behaviour subject value
      take(1),
      map(isAuthenticated => {
        console.log('isAuthenticated: ', isAuthenticated);
        if (!isAuthenticated) {
          this.router.navigateByUrl('/')
          return false;
        } else {
          return true;
        }
      })
    );
  }

}
