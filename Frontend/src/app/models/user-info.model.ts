import { Photo } from './photo.model';

export interface UserInfo {
  id?: string;
  userName: string;
  city: string;
  country: string;
  dateOfBirth: string;
  fullName: string;
  gender: string;
  status: string;
  about: string;
  created: Date;
  occupation: string;
  photos: Photo[];
}
