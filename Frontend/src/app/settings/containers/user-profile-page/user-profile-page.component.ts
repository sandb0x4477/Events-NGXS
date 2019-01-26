import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store, Select } from '@ngxs/store';

import { FetchUserInfo } from '../../state/settings.actions';
import { SettingsState } from '../../state/settings.state';
import { Observable } from 'rxjs';
import { UserInfo } from '../../../models/user-info.model';
import { Photo } from '../../../models/photo.model';

@Component({
  selector: 'app-user-profile-page',
  template: `
    <app-user-profile
      *ngIf="(userInfo$ | async) as userInfo"
      [userInfo]="userInfo"
    ></app-user-profile>
  `,
  styles: [],
})
export class UserProfilePageComponent implements OnInit {
  @Select(SettingsState.getUserInfo) userInfo$: Observable<UserInfo>;

  constructor(private store: Store, private route: ActivatedRoute) {}

  ngOnInit() {
    const userId = this.route.snapshot.paramMap.get('userId');
    // console.log('userId:', userId);
    this.store.dispatch(new FetchUserInfo(userId));
  }
}
