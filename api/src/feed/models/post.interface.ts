import { UserEntity } from './../../auth/models/user.entity';
import { User } from '../../auth/models/user.class';

export interface FeedPost {
  id?: number;
  body?: string;
  createdAt?: Date;
  updatedAt?: Date;
  author?: User;
}
