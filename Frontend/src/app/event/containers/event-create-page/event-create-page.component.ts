import { Component, OnInit } from '@angular/core';
import { Store } from '@ngxs/store';

@Component({
  selector: 'app-event-create-page',
  template: `
    <div class="col mb-3"><app-event-form></app-event-form></div>
  `,
  styles: [``],
})
export class EventCreatePageComponent implements OnInit {
  constructor( private store: Store) {}

  ngOnInit() {}
}
