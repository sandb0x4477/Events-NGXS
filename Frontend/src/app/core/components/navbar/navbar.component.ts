import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { ModalDirective } from 'angular-bootstrap-md';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Store, Select, Actions, ofActionSuccessful } from '@ngxs/store';
import { Navigate } from '@ngxs/router-plugin';

import { Login, Register, Logout, ChangeMainPhoto } from '../../state/auth.actions';
import { AuthState } from '../../state/auth.state';
import { SetMainPhoto } from '../../../settings/state/settings.actions';
import { SettingsState } from '../../../settings/state/settings.state';
import { AuthUser } from '../../../models/auth-user.model';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styles: [
    `
      img {
        width: 40px;
      }

      #avatar {
        padding: 2px !important;
      }

      .navbar-nav {
        align-items: center !important;
      }
    `,
  ],
})
export class NavbarComponent implements OnInit {
  // currentUser$: Observable<AuthUser>;

  @Select(AuthState.currentUser) currentUser$: Observable<AuthUser>;
  @Select(AuthState.isLoading) isLoading$: Observable<boolean>;

  @ViewChild('loginModal') loginModal: ModalDirective;
  @ViewChild('registerModal') registerModal: ModalDirective;
  loginForm: FormGroup;
  registerForm: FormGroup;

  static passwordMatchValidator(g: FormGroup) {
    return g.get('password').value === g.get('confirmPassword').value
      ? null
      : { mismatch: true };
  }

  constructor(
    private fb: FormBuilder,
    public store: Store,
    private router: Router,
    private actions$: Actions,
  ) {}

  ngOnInit() {
    this.createLoginForm();
    this.createRegisterForm();
    this.actions$.pipe(ofActionSuccessful(SetMainPhoto)).subscribe(() => {
      const userPhotos = this.store.selectSnapshot(SettingsState.getUserPhotos);
      const mainPhoto = userPhotos.filter(photo => photo.isMain === true);
      this.store.dispatch(new ChangeMainPhoto(mainPhoto[0]));
    });
  }

  createLoginForm() {
    this.loginForm = this.fb.group({
      email: ['user1@test.com', [Validators.required, Validators.email]],
      password: ['password', Validators.required],
    });
  }

  createRegisterForm() {
    this.registerForm = this.fb.group(
      {
        username: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        password: [
          '',
          [Validators.required, Validators.minLength(6), Validators.maxLength(16)],
        ],
        confirmPassword: ['', Validators.required],
      },
      { validator: NavbarComponent.passwordMatchValidator },
    );
  }

  login() {
    // console.log(this.loginForm.value);
    const payload = Object.assign({}, this.loginForm.value);
    this.store.dispatch(new Login(payload)).subscribe(
      () => {
        this.loginModal.hide();
        this.store.dispatch(new Navigate(['/events']));
      },
      err => {
        console.log(err);
      },
    );
  }

  register() {
    // console.log(this.registerForm.value);
    const payload = Object.assign({}, this.registerForm.value);
    this.store.dispatch(new Register(payload)).subscribe(
      () => {
        this.registerModal.hide();
      },
      err => {
        console.log(err);
      },
    );
  }

  logout() {
    this.store.dispatch(new Logout()).subscribe(
      () => {
        this.store.dispatch(new Navigate(['/']));
      },
      err => {
        console.log('Error logging out', err);
      },
    );
  }

  get userId() {
    const user = JSON.parse(localStorage.getItem('auth.currentUser'));
    return user.id;
  }
}
