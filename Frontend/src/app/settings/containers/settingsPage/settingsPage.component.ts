import { Component, OnInit } from '@angular/core';
import { Store, Select } from '@ngxs/store';

import { FetchUserInfo } from '../../state/settings.actions';
import { Observable } from 'rxjs';
import { SettingsState } from '../../state/settings.state';

@Component({
  selector: 'app-settings-page',
  templateUrl: './settingsPage.component.html',
  styles: [],
})
export class SettingsPageComponent implements OnInit {
  @Select(SettingsState.loading) loading$: Observable<boolean>;

  constructor(private store: Store) {}

  ngOnInit() {
    const currentUser = JSON.parse(localStorage.getItem('auth.currentUser'));
    this.store.dispatch(new FetchUserInfo(currentUser.id));
  }
}
