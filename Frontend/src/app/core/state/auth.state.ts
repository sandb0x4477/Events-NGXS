import { State, Action, StateContext, Selector } from '@ngxs/store';
import { tap } from 'rxjs/operators';

import { Login, Register, Logout, ChangeMainPhoto } from './auth.actions';
import { AuthService } from '../services/auth.service';

import { AuthUser } from '../../models/auth-user.model';

export interface AuthStateModel {
  currentUser: AuthUser;
  loading: boolean;
}

@State<AuthStateModel>({
  name: 'auth',
  defaults: { currentUser: {} as AuthUser, loading: false },
})
export class AuthState {
  constructor(private authService: AuthService) {}

  @Selector()
  public static getState(state: AuthStateModel) {
    return state;
  }

  @Selector()
  public static isLoading(state: AuthStateModel): boolean {
    return state.loading;
  }

  @Selector()
  public static token(state: AuthStateModel) {
    return state.currentUser.token;
  }

  @Selector()
  public static currentUser(state: AuthStateModel): AuthUser {
    return state.currentUser;
  }

  @Action(ChangeMainPhoto)
  public changeMainPhoto(
    { getState, patchState }: StateContext<AuthStateModel>,
    { payload }: any,
  ) {
    const state = getState();
    patchState({
      currentUser: { ...state.currentUser, mainPhotoUrl: payload.photoUrl },
    });
  }

  @Action(Login)
  public login(
    { getState, patchState }: StateContext<AuthStateModel>,
    { payload }: Login,
  ) {
    patchState({ loading: true });
    return this.authService.login(payload).pipe(
      tap((result: AuthUser) => {
        patchState({
          currentUser: result,
          loading: false,
        });
      }),
    );
  }

  // ? REGISTER
  @Action(Register, { cancelUncompleted: true })
  public register(
    { getState, patchState, dispatch }: StateContext<AuthStateModel>,
    { payload }: Register,
  ) {
    patchState({ loading: true });
    return this.authService.register(payload).pipe(
      tap(() => {
        patchState({
          loading: false,
        });
        dispatch(new Login({ email: payload.email, password: payload.password }));
      }),
    );
  }

  @Action(Logout)
  public logout({ setState, patchState }: StateContext<AuthStateModel>) {
    patchState({ loading: true });
    return setState({
      currentUser: {} as AuthUser,
      loading: false,
    });
  }
}
