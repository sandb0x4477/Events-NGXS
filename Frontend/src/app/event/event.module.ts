import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { MDBBootstrapModule } from 'angular-bootstrap-md';
import { NgxsModule } from '@ngxs/store';
import { NgxsFormPluginModule } from '@ngxs/form-plugin';
import { TimepickerModule } from 'ngx-bootstrap';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { AgmCoreModule } from '@agm/core';
import { MomentModule } from 'ngx-moment';

import { CacheInterceptor } from '../interceptors/cache.interceptor';
import { States } from './state/module.state';
import { EventService } from './services/event.service';
import { TokenInterceptor } from '../interceptors/token.interceptor';
import { EventRouterModule } from './event-router.module';
import { EventDashboardComponent } from './containers/event-dashboard/event-dashboard.component';
import { EventListComponent } from './components/event-list/event-list.component';
import { EventDetailPageComponent } from './containers/event-detail-page/event-detail-page.component';
import { SearchSpinnerComponent } from './components/search-spinner/search-spinner.component';
import { EventDetailComponent } from './components/event-detail/event-detail.component';
import { EventCreatePageComponent } from './containers/event-create-page/event-create-page.component';
import { EventFormComponent } from './components/event-form/event-form.component';
import { GooglePlaceModule } from 'ngx-google-places-autocomplete';
import { EventManageComponent } from './components/event-manage/event-manage.component';
import { EventManagePageComponent } from './containers/event-manage-page/event-manage-page.component';
import { EventActivityComponent } from './components/event-activity/event-activity.component';

export const COMPONENTS = [
  EventDashboardComponent,
  EventDetailPageComponent,
  EventListComponent,
  EventDetailComponent,
  EventCreatePageComponent,
  EventFormComponent,
  SearchSpinnerComponent,
  EventManagePageComponent,
  EventManageComponent,
  EventActivityComponent
];

@NgModule({
  imports: [
    CommonModule,
    EventRouterModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    GooglePlaceModule,
    NgxsFormPluginModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyAmuJbpsk9Ry_UgQMoyn-ZMXGXuVKYa5kU',
      libraries: ['places']
    }),
    MDBBootstrapModule.forRoot(),
    BsDatepickerModule.forRoot(),
    TimepickerModule.forRoot(),
    NgxsModule.forFeature(States),
    MomentModule
  ],
  declarations: COMPONENTS,
  providers: [
    EventService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true,
    },
    { provide: HTTP_INTERCEPTORS, useClass: CacheInterceptor, multi: true },
  ],
})
export class EventModule {}
