import { State, Selector, Action, StateContext } from '@ngxs/store';

import { Event, EventUser } from '../../models/event.model';
import { LoadEvents, GetEventDetail, CreateEvent, JoinEvent, CancelMyPlace, UpdateEvent } from './event.actions';
import { EventService } from '../services/event.service';
import { tap } from 'rxjs/operators';

export interface EventStateModel {
  loading: boolean;
  events: Event[];
  selectedEvent: Event;
  eventForm: {};
  manageForm: {};
}

@State<EventStateModel>({
  name: 'events',
  defaults: {
    loading: false,
    events: [],
    selectedEvent: undefined,
    eventForm: {
      model: undefined,
      dirty: false,
      status: '',
      errors: {},
    },
    manageForm: {
      model: undefined,
      dirty: false,
      status: '',
      errors: {},
    },
  },
})
export class EventState {
  constructor(private eventService: EventService) {}

  @Selector()
  public static getState(state: EventStateModel) {
    return state;
  }

  @Selector()
  public static loading(state: EventStateModel): boolean {
    return state.loading;
  }

  @Selector()
  public static getEvents(state: EventStateModel) {
    return state.events;
  }

  @Selector()
  public static selectedEvent(state: EventStateModel): Event {
    return state.selectedEvent;
  }

  @Action(LoadEvents)
  public loadEvents({ setState, patchState }: StateContext<EventStateModel>) {
    patchState({ loading: true });
    return this.eventService.loadEvents().pipe(
      tap((result: Event[]) => {
        patchState({
          events: result,
          loading: false,
        });
      }),
    );
  }

  @Action(GetEventDetail)
  public getEventDetail(
    { setState, patchState }: StateContext<EventStateModel>,
    { payload }: GetEventDetail,
  ) {
    patchState({ loading: true, selectedEvent: null });
    return this.eventService.getEventDetail(payload).pipe(
      tap((result: Event) => {
        const manageFormResponse = {
          id: result.id,
          title: result.title,
          category: result.category,
          description: result.description,
          city: result.city,
          venue: result.venue,
          venueLat: result.venueLat,
          venueLng: result.venueLng,
          isCancelled: result.isCancelled,
          date: result.date,
          time: result.time,
        };
        patchState({
          selectedEvent: result,
          loading: false,
          manageForm: { model: manageFormResponse}
        });
      }),
    );
  }

  @Action(CreateEvent)
  public createEvent(
    { setState, patchState, getState }: StateContext<EventStateModel>,
    { payload }: CreateEvent,
  ) {
    const state = getState();
    const eventForm = state.eventForm['model'];
    patchState({ loading: true });
    return this.eventService.createEvent(payload).pipe(
      tap((result: any) => {
        patchState({
          loading: false,
          eventForm: { model: undefined}
        });
      }),
    );
  }

  @Action(UpdateEvent)
  public updateEvent(
    { setState, patchState, getState }: StateContext<EventStateModel>,
    { payload }: UpdateEvent,
  ) {
    const state = getState();
    const manageForm = state.manageForm['model'];
    patchState({ loading: true });
    return this.eventService.updateEvent(payload).pipe(
      tap((result: any) => {
        patchState({
          loading: false,
          manageForm: { model: undefined}
        });
      }),
    );
  }

  @Action(JoinEvent)
  public joinEvent(
    { setState, patchState, getState }: StateContext<EventStateModel>,
    { payload }: JoinEvent,
  ) {
    const state = getState();
    const user = JSON.parse(localStorage.getItem('auth.currentUser'));
    const newUserEvent: EventUser = {
      userId: user.id,
      userName: user.username,
      isHost: false,
      photoUrl: user.mainPhotoUrl
    };
    const event = state.events.find(e => e.id === payload);
    patchState({ loading: true });
    return this.eventService.joinEvent(payload).pipe(
      tap((result: any) => {
        // const eventsArray = state.events.map((el, index) => {
        //   if (el.id === payload) {
        //     return {
        //       ...el, eventUsers: [...event.eventUsers, newUserEvent]
        //     };
        //   }
        //   return el;
        // });
        patchState({
          loading: false,
          // events: eventsArray,
          selectedEvent: {...state.selectedEvent, eventUsers: [...state.selectedEvent.eventUsers, newUserEvent]}
        });
      }),
    );
  }

  @Action(CancelMyPlace)
  public cancelMyPlace(
    { setState, patchState, getState }: StateContext<EventStateModel>,
    { payload }: CancelMyPlace,
  ) {
    const state = getState();
    const user = JSON.parse(localStorage.getItem('auth.currentUser'));
    const event = state.events.find(e => e.id === payload);
    patchState({ loading: true });
    return this.eventService.cancelMyPlace(payload).pipe(
      tap((result: any) => {
        // const eventsArray = state.events.map((el, index) => {
        //   if (el.id === payload) {
        //     return {
        //       ...el, eventUsers: event.eventUsers.filter(u => u.userId !== user.id)
        //     };
        //   }
        //   return el;
        // });
        const selectedEventUsers = state.selectedEvent.eventUsers.filter(u => u.userId !== user.id);
        patchState({
          loading: false,
          // events: eventsArray,
          selectedEvent: {...state.selectedEvent, eventUsers: selectedEventUsers}
        });
      }),
    );
  }


}
