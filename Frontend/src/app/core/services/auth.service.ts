import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { environment } from '../../../environments/environment';
import { AuthUser } from '../../models/auth-user.model';

@Injectable()
export class AuthService {
  private apiURL: string = environment.apiURL + 'auth/';

  constructor(private http: HttpClient) {}

  login(payload: { email: string, password: string }): Observable<AuthUser> {
    return this.http.post(this.apiURL + 'login', payload).pipe(
      mergeMap((response: AuthUser) => {
        return of(response);
      }),
    );
  }

  register(payload: { username: string, email: string, password: string }): Observable<any> {
    return this.http.post(this.apiURL + 'register', payload).pipe(
      mergeMap(() => {
        return of(true);
      }),
    );
  }
}
