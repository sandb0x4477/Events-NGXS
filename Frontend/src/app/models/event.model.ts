export interface Event {
  id: string;
  title: string;
  category: string;
  description: string;
  city: string;
  venue: string;
  venueLat: number;
  venueLng: number;
  isCancelled: boolean;
  date: Date;
  created: string;
  eventUsers: EventUser[];
}

export interface EventUser {
  userId: string;
  userName: string;
  isHost: boolean;
  photoUrl: string;
}
