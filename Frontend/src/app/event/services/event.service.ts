import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { environment } from '../../../environments/environment';
import { Event } from '../../models/event.model';
import { Activity } from '../../models/activity.model';
import { Chat } from '../../models/chat.model';

@Injectable()
export class EventService {
  private apiURL: string = environment.apiURL + 'events/';
  private activityURL: string = environment.apiURL + 'activity/';
  private chatURL: string = environment.apiURL + 'chats/';

  constructor(private http: HttpClient) {}

  createMessage(payload: any): Observable<Chat> {
    return this.http.post<Chat>(this.chatURL, payload);
  }

  loadChat(id: string): Observable<Chat[]> {
    return this.http.get<Chat[]>(this.chatURL + id);
  }

  loadActivity(): Observable<Activity[]> {
    return this.http.get<Activity[]>(this.activityURL);
  }

  // ? LOAD EVENTS
  loadEvents(): Observable<Event[]> {
    return this.http.get<Event[]>(this.apiURL);
  }

  getEventDetail(payload: any): Observable<Event> {
    return this.http.get<Event>(this.apiURL + payload).pipe(
      mergeMap((response: Event) => {
        // console.log('response:', response);
        return of(response);
      }),
    );
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
