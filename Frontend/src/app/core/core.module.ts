import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { ButtonsModule, InputsModule, WavesModule, NavbarModule, ModalModule, DropdownModule } from 'angular-bootstrap-md';

import { NotFoundPageComponent } from './containers/not-found-page/not-found-page.component';
import { AppComponent } from './containers/app/app.component';
import { HomeComponent } from './components/home/home.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { AuthService } from './services/auth.service';

export const COMPONENTS = [
  AppComponent,
  HomeComponent,
  NavbarComponent,
  NotFoundPageComponent,
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    HttpClientModule,
    ButtonsModule,
    InputsModule.forRoot(),
    WavesModule.forRoot(),
    ModalModule.forRoot(),
    DropdownModule.forRoot(),
    NavbarModule
  ],
  declarations: COMPONENTS,
  exports: COMPONENTS,
})
export class CoreModule {
  static forRoot() {
    return {
      ngModule: CoreModule,
      providers: [AuthService],
    };
  }
}
