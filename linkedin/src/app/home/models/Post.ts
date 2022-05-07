import { User } from '../../auth/models/user.model';

export interface Post {
  id: number;
  body: string;
  createAt: Date;
  author: User;
}
