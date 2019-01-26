import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';


import { environment } from '../../../environments/environment';
import { UserInfo } from '../../models/user-info.model';

@Injectable()
export class SettingsService {
  private api: string = environment.apiURL + 'users/';
  private apiPhotos: string = environment.apiURL + 'photos/';

  constructor(private http: HttpClient) {}

  getUserInfo(id: string): Observable<UserInfo> {
    return this.http.get<UserInfo>(`${this.api}${id}`);
  }

  updateUserInfo(payload: Partial<UserInfo>): Observable<any> {
    return this.http.patch(`${this.api}${this.getUserId()}`, payload);
  }

  deletePhoto(photoId: string): Observable<any> {
    return this.http.delete(this.apiPhotos + photoId);
  }

  setMainPhoto(photoId: string): Observable<any> {
    return this.http.post(`${this.apiPhotos}${photoId}/setMain`, {});
  }

  private getUserId(): string {
    const currentUser = JSON.parse(localStorage.getItem('auth.currentUser'));
    return currentUser.id;
  }
}
