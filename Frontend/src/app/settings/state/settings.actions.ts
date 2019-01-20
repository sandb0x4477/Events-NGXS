import { UserInfo } from '../../models/user-info.model';
import { Photo } from '../../models/photo.model';

export class FetchUserInfo {
  static readonly type = '[SETTINGS] Fetch User Info';
  constructor(public payload: string) {}
}

export class UpdateUserInfo {
  static readonly type = '[SETTINGS] Update User Info';
  constructor(public payload: Partial<UserInfo>) {}
}

export class DeleteUserPhoto {
  static readonly type = '[SETTINGS] Delete User Photo';
  constructor(public payload: string) {}
}

export class AddUserPhoto {
  static readonly type = '[SETTINGS] Add User Photo';
  constructor(public payload: Photo) {}
}

export class SetMainPhoto {
  static readonly type = '[SETTINGS] Set Main Photo';
  constructor(public payload: string) {}
}

