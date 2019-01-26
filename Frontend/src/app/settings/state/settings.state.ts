import { State, Selector, Action, StateContext } from '@ngxs/store';
import { tap } from 'rxjs/operators';

import { SettingsService } from '../services/settings.service';
import { UserInfo } from '../../models/user-info.model';
import { Photo } from '../../models/photo.model';
import {
  FetchUserInfo,
  UpdateUserInfo,
  DeleteUserPhoto,
  AddUserPhoto,
  SetMainPhoto,
} from './settings.actions';

export interface SettingsStateModel {
  loading: boolean;
  userInfo: UserInfo;
  basicForm: {};
  aboutForm: {};
}

@State<SettingsStateModel>({
  name: 'settings',
  defaults: {
    loading: false,
    userInfo: undefined,
    basicForm: {
      model: undefined,
      dirty: false,
      status: '',
      errors: {},
    },
    aboutForm: {
      model: undefined,
      dirty: false,
      status: '',
      errors: {},
    },
  },
})
export class SettingsState {
  constructor(private settingsService: SettingsService) {}

  @Selector()
  public static getState(state: SettingsStateModel) {
    return state;
  }

  @Selector()
  public static loading(state: SettingsStateModel): boolean {
    return state.loading;
  }

  @Selector()
  public static getUserInfo(state: SettingsStateModel) {
    return state.userInfo;
  }

  @Selector()
  public static getUserPhotos(state: SettingsStateModel) {
    return state.userInfo.photos;
  }

  @Action(FetchUserInfo)
  fetchUserInfo(
    { setState, patchState }: StateContext<SettingsStateModel>,
    { payload }: FetchUserInfo,
  ) {
    patchState({ loading: true });
    return this.settingsService.getUserInfo(payload).pipe(
      tap((result: UserInfo) => {
        console.log('userInfo:', result);
        const basicFormResponse = {
          fullName: result.fullName,
          dateOfBirth: result.dateOfBirth,
          gender: result.gender,
          city: result.city,
          country: result.country,
        };
        const aboutFormResponse = {
          status: result.status,
          about: result.about,
          occupation: result.occupation,
        };
        patchState({
          userInfo: result,
          loading: false,
          basicForm: { model: basicFormResponse },
          aboutForm: { model: aboutFormResponse },
        });
      }),
    );
  }

  @Action(UpdateUserInfo)
  updateUserInfo(
    { setState, patchState, getState }: StateContext<SettingsStateModel>,
    { payload }: UpdateUserInfo,
  ) {
    patchState({ loading: true });
    return this.settingsService.updateUserInfo(payload).pipe(
      tap(() => {
        patchState({
          loading: false,
        });
      }),
    );
  }

  @Action(DeleteUserPhoto)
  deleteUserPhoto(
    { setState, patchState, getState }: StateContext<SettingsStateModel>,
    { payload }: DeleteUserPhoto,
  ) {
    patchState({ loading: true });

    return this.settingsService.deletePhoto(payload).pipe(
      tap((result: UserInfo) => {
        const state = getState();
        const filteredArray: Photo[] = state.userInfo.photos.filter(
          photo => photo.id !== payload,
        );
        patchState({
          loading: false,
          userInfo: { ...state.userInfo, photos: filteredArray },
        });
      }),
    );
  }

  @Action(AddUserPhoto)
  addUserPhoto(
    { setState, patchState, getState }: StateContext<SettingsStateModel>,
    { payload }: AddUserPhoto,
  ) {
    const state = getState();
    patchState({
      userInfo: { ...state.userInfo, photos: [...state.userInfo.photos, payload] },
    });
  }

  @Action(SetMainPhoto)
  setMainPhoto(
    { setState, patchState, getState }: StateContext<SettingsStateModel>,
    { payload }: SetMainPhoto,
  ) {
    const state = getState();
    const photoArray: Photo[] = state.userInfo.photos.map((photo, index) => {
      if (photo.id === payload) {
        return {
          ...photo,
          isMain: true,
        };
      }
      return {
        ...photo,
        isMain: false,
      };
    });
    patchState({ loading: true });
    return this.settingsService.setMainPhoto(payload).pipe(tap(() => {
      patchState({
        loading: false,
        userInfo: { ...state.userInfo, photos: photoArray },
      });
    }));
  }
}
