import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { MDBBootstrapModule } from 'angular-bootstrap-md';
import { NgxsModule } from '@ngxs/store';
import { NgxsFormPluginModule } from '@ngxs/form-plugin';
import { FileUploadModule } from 'ng2-file-upload';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { GooglePlaceModule } from 'ngx-google-places-autocomplete';

import { TokenInterceptor } from '../interceptors/token.interceptor';
import { SettingsRoutingModule } from './settings-routing.module';
import { States } from './state/module.state';

import { SettingsService } from './services/settings.service';
import { SettingsPageComponent } from './containers/settingsPage/settingsPage.component';
import { SearchSpinnerComponent } from './components/search-spinner/search-spinner.component';
import { SettingsBasicComponent } from './components/settings-basic/settings-basic.component';
import { SettingsMenuComponent } from './components/settings-menu/settings-menu.component';
import { SettingsAboutComponent } from './components/settings-about/settings-about.component';
import { SettingsPhotosComponent } from './components/settings-photos/settings-photos.component';
import { UserProfilePageComponent } from './containers/user-profile-page/user-profile-page.component';
import { UserProfileComponent } from './components/user-profile/user-profile.component';

export const COMPONENTS = [
  SettingsPageComponent,
  SearchSpinnerComponent,
  SettingsBasicComponent,
  SettingsMenuComponent,
  SettingsAboutComponent,
  SettingsPhotosComponent,
  UserProfilePageComponent,
  UserProfileComponent
];

@NgModule({
  declarations: COMPONENTS,
  imports: [
    CommonModule,
    HttpClientModule,
    ReactiveFormsModule,
    NgxsFormPluginModule,
    FileUploadModule,
    NgxsModule.forFeature(States),
    SettingsRoutingModule,
    GooglePlaceModule,
    MDBBootstrapModule.forRoot(),
    BsDatepickerModule.forRoot(),
  ],
  providers: [
    SettingsService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true,
    },
  ],
})
export class SettingsModule {}
