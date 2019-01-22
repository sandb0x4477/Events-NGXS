import { Component, OnInit } from '@angular/core';
import { Store } from '@ngxs/store';
import { Login } from '../../state/auth.actions';

@Component({
  selector: 'app-home',
  template: `
  <!-- Jumbotron Header -->
  <header class="jumbotron my-4 align-items-center">
    <h4 class="display-5">Join our Events Comunity!</h4>
    <br>
    <button class="btn btn-primary mr-3" [routerLink]="['/events']"
      >Enter</button>
    <button class="btn btn-secondary mr-3" (click)="login()"
      >...or Login as User1 for testing</button>

  </header>
  `,
  styles: [
    `
      .home {
        -webkit-background-size: cover;
        -moz-background-size: cover;
        background-size: cover;
        -o-background-size: cover;
      }
    `,
  ],
})
export class HomeComponent implements OnInit {
  constructor(private store: Store) {}

  ngOnInit() {}

  login() {
    this.store.dispatch(new Login({email: 'user1@test.com', password: 'password'}));
  }
}
