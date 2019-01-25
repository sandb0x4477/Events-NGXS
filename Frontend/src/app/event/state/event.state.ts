import { State, Selector, Action, StateContext } from '@ngxs/store';

import { Event, EventUser } from '../../models/event.model';
// tslint:disable-next-line:max-line-length
import { LoadEvents, GetEventDetail, CreateEvent, JoinEvent, CancelMyPlace, UpdateEvent, LoadActivity, LoadChat, CreateChatMessage } from './event.actions';
import { EventService } from '../services/event.service';
import { tap } from 'rxjs/operators';
import { Activity } from '../../models/activity.model';
import { Chat } from '../../models/chat.model';

export interface EventStateModel {
  loading: boolean;
  events: Event[];
  selectedEvent: Event;
  eventForm: {};
  manageForm: {};
  activity: Activity[];
  chat: Chat[];
}

@State<EventStateModel>({
  name: 'events',
  defaults: {
    loading: false,
    events: [],
    selectedEvent: undefined,
    activity: [],
    chat: [],
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
  public static getActivity(state: EventStateModel) {
    return state.activity;
  }

  @Selector()
  public static getEvents(state: EventStateModel) {
    return state.events;
  }

  @Selector()
  public static getChat(state: EventStateModel) {
    return state.chat;
  }

  @Selector()
  public static selectedEvent(state: EventStateModel): Event {
    return state.selectedEvent;
  }

  @Action(LoadActivity)
  public loadActivity({ setState, patchState }: StateContext<EventStateModel>) {
    patchState({ loading: true });
    return this.eventService.loadActivity().pipe(
      tap((result: Activity[]) => {
        patchState({
          activity: result,
          loading: false,
        });
      }),
    );
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

  @Action(LoadChat)
  public loadChat(
    { setState, patchState }: StateContext<EventStateModel>,
    { payload }: LoadChat,
  ) {
    patchState({ loading: true, chat: [] });
    return this.eventService.loadChat(payload).pipe(
      tap((result: Chat[]) => {
        patchState({
          loading: false,
          chat: result
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

  @Action(CreateChatMessage)
  public createChatMessage(
    { setState, patchState, getState }: StateContext<EventStateModel>,
    { payload }: CreateChatMessage,
  ) {
    patchState({ loading: true });
    return this.eventService.createMessage(payload).pipe(
      tap((result: Chat) => {
        const state = getState();
        patchState({
          loading: false,
          chat: [...state.chat, result]
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
