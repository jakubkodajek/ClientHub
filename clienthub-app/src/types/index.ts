import { Timestamp } from 'firebase/firestore';

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  photoURL: string;
}

export interface Client {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  createdAt: Timestamp;
}

export interface Link {
  id: string;
  name: string;
  url: string;
  description: string;
  icon: string;
  order?: number;
  createdAt: Timestamp;
}
