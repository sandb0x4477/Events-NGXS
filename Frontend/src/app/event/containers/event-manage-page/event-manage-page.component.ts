import { Component, OnInit } from '@angular/core';
import { Store, Select } from '@ngxs/store';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';

import { GetEventDetail, UpdateEvent } from '../../state/event.actions';
import { EventState } from '../../state/event.state';

@Component({
  selector: 'app-event-manage-page',
  template: `
    <app-event-manage
      (cancel)="onCancel($event)"
      (updateEvent)="onUpdateEvent($event)"
    ></app-event-manage>
  `,
  styles: [``],
})
export class EventManagePageComponent implements OnInit {
  @Select(EventState.loading) loading$: Observable<boolean>;
  @Select(EventState.selectedEvent) event$: Observable<Event>;
  eventId: string;

  constructor(
    private store: Store,
    private route: ActivatedRoute,
    private router: Router,
  ) {}

  ngOnInit() {
    this.eventId = this.route.snapshot.paramMap.get('eventId');
    this.store.dispatch(new GetEventDetail(this.eventId));
  }

  onCancel(event) {
    this.router.navigate(['/events', this.eventId]);
  }

  onUpdateEvent(event) {
    this.store.dispatch(new UpdateEvent(event)).subscribe(res => {
      this.router.navigate(['/events', this.eventId]);
    });
  }
}
