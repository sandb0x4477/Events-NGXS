import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store, Select } from '@ngxs/store';
import { Observable } from 'rxjs';

import {
  GetEventDetail,
  JoinEvent,
  CancelMyPlace,
  LoadChat,
  CreateChatMessage,
} from '../../state/event.actions';
import { EventState } from '../../state/event.state';
import { Chat } from '../../../models/chat.model';

// <app-search-spinner *ngIf="(loading$ | async)"></app-search-spinner>

@Component({
  selector: 'app-event-detail-page',
  template: `
    <ng-container *ngIf="(event$ | async) as event">
      <div class="row">
        <div class="col-md-4 d-none d-sm-none d-md-block">
          <app-event-users [event]="event"></app-event-users>
        </div>
        <div class="col-md-8 col-sm-12">
          <app-event-detail
            [event]="event"
            (joinEvent)="onJoinEvent($event)"
            (cancelPlace)="onCancelMyPlace($event)"
          ></app-event-detail>
          <ng-container *ngIf="(chat$ | async) as chats">
            <app-event-chat
            [chats]="chats" (message)="onSubmitMessage($event)">
            </app-event-chat>
          </ng-container>
        </div>
      </div>
    </ng-container>
  `,
  styles: [],
})
export class EventDetailPageComponent implements OnInit {
  @Select(EventState.loading) loading$: Observable<boolean>;
  @Select(EventState.selectedEvent) event$: Observable<Event>;
  @Select(EventState.getChat) chat$: Observable<Chat[]>;

  eventId: string;

  constructor(private store: Store, private route: ActivatedRoute) {}

  ngOnInit() {
    this.eventId = this.route.snapshot.paramMap.get('eventId');
    this.store.dispatch(new GetEventDetail(this.eventId));
    this.store.dispatch(new LoadChat(this.eventId));
  }

  onJoinEvent(eventId: string) {
    this.store.dispatch(new JoinEvent(this.eventId));
  }

  onCancelMyPlace(eventId: string) {
    this.store.dispatch(new CancelMyPlace(this.eventId));
  }

  onSubmitMessage(event: any) {
    const payload = {...event, eventId: this.eventId};
    this.store.dispatch(new CreateChatMessage(payload));
  }
}
