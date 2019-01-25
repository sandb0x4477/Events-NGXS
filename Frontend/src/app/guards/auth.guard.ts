import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(
    private router: Router) { }

  canActivate(): boolean {
    const user = JSON.parse(localStorage.getItem('auth.currentUser'));
    if (user.token) {
      return true;
    }

    window.alert('Please register or login');
    // this.router.navigate(['/']);
    return false;
  }
}
