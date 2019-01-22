import { Component, OnInit, Input } from '@angular/core';

import { UserInfo } from '../../../models/user-info.model';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit {
  @Input() userInfo: UserInfo;

  constructor() { }

  ngOnInit() {
  }

  get userPhotos() {
    return this.userInfo.photos;
  }

  get mainPhoto() {
    return this.userInfo.photos.find(p => p.isMain).photoUrl;
  }

}
