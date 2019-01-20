import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './core/components/home/home.component';
import { NotFoundPageComponent } from './core/containers/not-found-page/not-found-page.component';

const routes: Routes = [
  { path: 'events', loadChildren: './event/event.module#EventModule' },
  { path: 'settings', loadChildren: './settings/settings.module#SettingsModule' },
  { path: '', pathMatch: 'full', component: HomeComponent },
  { path: '**', component: NotFoundPageComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { enableTracing: false })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
