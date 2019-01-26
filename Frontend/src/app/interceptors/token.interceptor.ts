import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from '@angular/common/http';
import { Observable, timer } from 'rxjs';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  constructor() {}
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    request = request.clone({
      setHeaders: {
        Authorization: `Bearer ${this.getToken()}`,
      },
    });
    // return timer(600).pipe(switchMap(() => next.handle(request)));
    return next.handle(request);
  }

  private getToken(): string {
    const currentUser = JSON.parse(localStorage.getItem('auth.currentUser'));
    const token = currentUser.token;
    // const token = this.store.selectSnapshot(state => state.auth.currentUser.token);
    return token ? token : '';
  }
}
