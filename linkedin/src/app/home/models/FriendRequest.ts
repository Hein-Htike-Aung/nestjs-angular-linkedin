import { User } from '../../auth/models/user.model';

export type FriendRequest_Status_Type =
  | 'not-sent'
  | 'waiting-for-current-user-response'
  | 'pending'
  | 'accepted'
  | 'declined';

export interface FriendRequestStatus {
  status?: FriendRequest_Status_Type;
}

export interface FriendRequest {
  id?: number;
  creatorId: number;
  receiverId: number;
  status?: FriendRequest_Status_Type;
}
