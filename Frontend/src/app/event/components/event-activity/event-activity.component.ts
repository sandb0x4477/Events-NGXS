import { Component, OnInit, Input } from '@angular/core';
import { Activity } from '../../../models/activity.model';

@Component({
  selector: 'app-event-activity',
  templateUrl: './event-activity.component.html',
  styleUrls: ['./event-activity.component.scss']
})
export class EventActivityComponent implements OnInit {
  @Input() activity: Activity[];

  constructor() { }

  ngOnInit() {
  }

}
