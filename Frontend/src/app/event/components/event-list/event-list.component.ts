import { Component, OnInit, Input, ChangeDetectionStrategy } from '@angular/core';
import { Event } from '../../../models/event.model';

@Component({
  selector: 'app-event-list',
  templateUrl: './event-list.component.html',
  styleUrls: ['./event-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EventListComponent implements OnInit {
  @Input() events: Event[];

  constructor() { }

  ngOnInit() {
  }

}
