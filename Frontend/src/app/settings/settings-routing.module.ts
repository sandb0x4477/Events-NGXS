import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SettingsPageComponent } from './containers/settingsPage/settingsPage.component';
import { SettingsBasicComponent } from './components/settings-basic/settings-basic.component';
import { SettingsAboutComponent } from './components/settings-about/settings-about.component';
import { SettingsPhotosComponent } from './components/settings-photos/settings-photos.component';
import { UserProfilePageComponent } from './containers/user-profile-page/user-profile-page.component';

const routes: Routes = [
  { path: '', component: SettingsPageComponent,
    children: [
      { path: 'basic', component: SettingsBasicComponent },
      { path: 'about', component: SettingsAboutComponent },
      { path: 'photos', component: SettingsPhotosComponent },
    ]
  },
  {path: 'user/:userId', component: UserProfilePageComponent}

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SettingsRoutingModule { }
