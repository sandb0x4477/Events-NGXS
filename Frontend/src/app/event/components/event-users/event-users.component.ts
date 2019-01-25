import { Component, OnInit, Input } from '@angular/core';
import { Event } from '../../../models/event.model';

@Component({
  selector: 'app-event-users',
  templateUrl: './event-users.component.html',
  styleUrls: ['./event-users.component.scss']
})
export class EventUsersComponent implements OnInit {
  @Input() event: Event;

  constructor() { }

  ngOnInit() {
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

  // get isGoing() {
  //   return this.eventUsers.some(u => u.userId === this.currentUserId);
  // }

  get currentUserId() {
    const user = JSON.parse(localStorage.getItem('auth.currentUser'));
    return user.id;
  }

}
