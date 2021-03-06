export class CreateChatMessage {
  static readonly type = '[EVENT] Create Message';
  constructor(public payload: any) {}
}

export class LoadChat {
  static readonly type = '[EVENT] Load Chat';
  constructor(public payload: string) {}
}

export class LoadActivity {
  static readonly type = '[EVENT] Load Activity';
  constructor() {}
}

export class LoadEvents {
  static readonly type = '[EVENT] Load Events';
  constructor() {}
}

export class GetEventDetail {
  static readonly type = '[EVENT] Get event details';
  constructor(public payload: string) {}
}

export class CreateEvent {
  static readonly type = '[EVENT] Create New Event';
  constructor(public payload: any) {}
}

export class UpdateEvent {
  static readonly type = '[EVENT] Update Event';
  constructor(public payload: any) {}
}

export class JoinEvent {
  static readonly type = '[EVENT] Join Event';
  constructor(public payload: string) {}
}

export class CancelMyPlace {
  static readonly type = '[EVENT] Cancel My Place';
  constructor(public payload: string) {}
}

