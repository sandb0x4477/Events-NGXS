import { Component, OnInit, Input, ChangeDetectionStrategy, Output, EventEmitter } from '@angular/core';

import { Event } from '../../../models/event.model';

@Component({
  selector: 'app-event-detail',
  templateUrl: './event-detail.component.html',
  styleUrls: ['./event-detail.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EventDetailComponent implements OnInit {
  @Input() event: Event;
  @Output() joinEvent = new EventEmitter<string>();
  @Output() cancelPlace = new EventEmitter<string>();


  // google maps zoom level
  zoom = 15;
  showMap = false;

  constructor() {}

  ngOnInit() {}

  manageEvent(eventId: string) {
    console.log(eventId);

  }

  showMapToggle() {
    this.showMap = !this.showMap;
  }

  joinThisEvent(eventId: string) {
    const user = JSON.parse(localStorage.getItem('auth.currentUser'));
    if (!user.token) {
      window.alert('Please login or register first');
      return;
    }
    this.joinEvent.emit(eventId);
  }

  cancelMyPlace(eventId: string) {
    this.cancelPlace.emit(eventId);
  }

  get eventUsers() {
    return this.event.eventUsers.filter(u => u.isHost === false);
  }

  get eventHost() {
    return this.event.eventUsers.filter(u => u.isHost === true);
  }

  get isHost() {
    return this.currentUserId === this.eventHost[0].userId;
  }

  get isGoing() {
    return this.eventUsers.some(u => u.userId === this.currentUserId);
  }

  get currentUserId() {
    const user = JSON.parse(localStorage.getItem('auth.currentUser'));
    return user.id;
  }
}
