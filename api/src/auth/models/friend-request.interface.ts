import { User } from './user.class';
export type FriendRequest_Status_Type = 'pending' | 'accepted' | 'declined';

export interface FriendRequestStatus {
  status?: FriendRequest_Status_Type;
}

export interface FriendRequest {
  id?: number;
  creator?: User;
  receiver?: User;
  status?: FriendRequest_Status_Type;
}
