import { Component, OnInit } from '@angular/core';
import { Store, Select } from '@ngxs/store';
import { Observable } from 'rxjs';

import { LoadEvents, LoadActivity } from '../../state/event.actions';
import { EventState } from '../../state/event.state';
import { Event } from '../../../models/event.model';
import { Activity } from '../../../models/activity.model';

// <ng-container *ngIf="(loading$ | async)">
//   <app-search-spinner></app-search-spinner>
// </ng-container>

@Component({
  selector: 'app-event-dashboard',
  template: `
    <div class="row">
      <ng-container *ngIf="(activity$ | async) as activity">
        <div class="col-md-4 d-none d-sm-none d-md-block">
        <app-event-activity [activity]="activity"></app-event-activity>
        </div>
      </ng-container>
      <ng-container *ngIf="(events$ | async) as events">
        <div class="col-md-8 col-sm-12">
          <app-event-list [events]="events"></app-event-list>
        </div>
      </ng-container>
    </div>
  `,
  styles: [],
})
export class EventDashboardComponent implements OnInit {
  @Select(EventState.loading) loading$: Observable<boolean>;
  @Select(EventState.getEvents) events$: Observable<Event[]>;
  @Select(EventState.getActivity) activity$: Observable<Activity[]>;

  constructor(private store: Store) {}

  ngOnInit() {
    this.store.dispatch(new LoadEvents());
    this.store.dispatch(new LoadActivity());
  }
}
