import { Component, OnInit } from '@angular/core';
import { Store, Select } from '@ngxs/store';
import { Observable } from 'rxjs';

import { LoadEvents } from '../../state/event.actions';
import { EventState } from '../../state/event.state';
import { Event } from '../../../models/event.model';

// <ng-container *ngIf="(loading$ | async)">
//   <app-search-spinner></app-search-spinner>
// </ng-container>

@Component({
  selector: 'app-event-dashboard',
  template: `
    <ng-container *ngIf="(events$ | async) as events">
      <div class="row">
        <div class="col-md-4 d-none d-sm-none d-md-block ">Activity</div>
        <div class="col-md-8 col-sm-12">
          <app-event-list [events]="events"></app-event-list>
        </div>
      </div>
    </ng-container>
  `,
  styles: [],
})
export class EventDashboardComponent implements OnInit {
  @Select(EventState.loading) loading$: Observable<boolean>;
  @Select(EventState.getEvents) events$: Observable<Event[]>;

  constructor(private store: Store) {}

  ngOnInit() {
    this.store.dispatch(new LoadEvents());
  }
}
