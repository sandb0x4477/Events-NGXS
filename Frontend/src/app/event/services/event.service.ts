import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { environment } from '../../../environments/environment';
import { Event } from '../../models/event.model';

@Injectable()
export class EventService {
  private apiURL: string = environment.apiURL + 'events/';

  constructor(private http: HttpClient) {}

  // ? LOAD EVENTS
  loadEvents(): Observable<Event[]> {
    return this.http.get<Event[]>(this.apiURL);
  }

  getEventDetail(payload: any): Observable<Event> {
    return this.http.get<Event>(this.apiURL + payload);
    // .pipe(
    //   mergeMap((response: Event) => {
    //     console.log('response:', response);
    //     return of(response);
    //   }),
    // );
  }

  createEvent(payload: any): Observable<any> {
    return this.http.post(this.apiURL, payload);
  }

  updateEvent(payload: any): Observable<any> {
    return this.http.patch(this.apiURL, payload);
  }

  joinEvent(payload: string): Observable<any> {
    return this.http.post(this.apiURL + payload, {});
  }

  cancelMyPlace(payload: string): Observable<any> {
    return this.http.post(this.apiURL + payload + '/cancel', {});
  }
}
