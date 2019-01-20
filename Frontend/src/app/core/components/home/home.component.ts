import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  template: `
  <!-- Jumbotron Header -->
  <header class="jumbotron my-4 align-items-center">
    <h4 class="display-5">Join our Events Comunity!</h4>
    <br>
    <button class="btn btn-primary mr-3" [routerLink]="['/register']"
      >Register for free!!!!</button
    >
    <button class="btn btn-secondary mr-3" (click)="login()"
      >...Login as User1</button
    >
    <button class="btn btn-info " (click)="login()"
      >...or Enter The Site</button
    >
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
  constructor() {}

  ngOnInit() {}

  login() {}
}
