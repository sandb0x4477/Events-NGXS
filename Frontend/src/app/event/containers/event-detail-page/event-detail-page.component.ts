import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store, Select } from '@ngxs/store';
import { Observable } from 'rxjs';

import { GetEventDetail, JoinEvent, CancelMyPlace } from '../../state/event.actions';
import { EventState } from '../../state/event.state';

// <app-search-spinner *ngIf="(loading$ | async)"></app-search-spinner>

@Component({
  selector: 'app-event-detail-page',
  template: `
    <app-event-detail
      *ngIf="(event$ | async) as event"
      [event]="event"
      (joinEvent)="onJoinEvent($event)"
      (cancelPlace)="onCancelMyPlace($event)"
    ></app-event-detail>
  `,
  styles: [],
})
export class EventDetailPageComponent implements OnInit {
  @Select(EventState.loading) loading$: Observable<boolean>;
  @Select(EventState.selectedEvent) event$: Observable<Event>;

  constructor(private store: Store, private route: ActivatedRoute) {}

  ngOnInit() {
    const eventId = this.route.snapshot.paramMap.get('eventId');
    this.store.dispatch(new GetEventDetail(eventId));
  }

  onJoinEvent(eventId: string) {
    this.store.dispatch(new JoinEvent(eventId));
  }

  onCancelMyPlace(eventId: string) {
    this.store.dispatch(new CancelMyPlace(eventId));
  }
}
