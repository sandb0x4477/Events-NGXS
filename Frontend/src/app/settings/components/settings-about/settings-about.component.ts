import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Store } from '@ngxs/store';

import { UserInfo } from '../../../models/user-info.model';
import { UpdateUserInfo } from '../../state/settings.actions';

@Component({
  selector: 'app-settings-about',
  templateUrl: './settings-about.component.html',
  styleUrls: ['./settings-about.component.scss'],
})
export class SettingsAboutComponent implements OnInit {
  aboutForm: FormGroup;
  userInfo: UserInfo;

  constructor(private fb: FormBuilder, public store: Store) {}

  ngOnInit() {
    this.createAboutForm();
  }

  createAboutForm() {
    this.aboutForm = this.fb.group({
      status: null,
      about: null,
      occupation: null,
    });
  }

  updateProfile() {
    // console.log(this.aboutForm.value);
    const user = JSON.parse(localStorage.getItem('user'));
    this.userInfo = Object.assign({}, this.aboutForm.getRawValue());
    this.store.dispatch(new UpdateUserInfo(this.userInfo)).subscribe(() => {
      console.log('Success');
    });
  }
}
