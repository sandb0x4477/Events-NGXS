import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { EventDashboardComponent } from './containers/event-dashboard/event-dashboard.component';
import { EventDetailPageComponent } from './containers/event-detail-page/event-detail-page.component';
import { EventCreatePageComponent } from './containers/event-create-page/event-create-page.component';
import { EventManagePageComponent } from './containers/event-manage-page/event-manage-page.component';

const routes: Routes = [
  {
    path: '', component: EventDashboardComponent,
  },
  { path: 'create', pathMatch: 'full', component: EventCreatePageComponent },
  { path: ':eventId', component: EventDetailPageComponent },
  { path: ':eventId/manage', component: EventManagePageComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EventRouterModule {}
