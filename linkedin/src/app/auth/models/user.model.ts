import { Post } from '../../home/models/Post';

export type Role = 'admin' | 'premium' | 'user';

export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: Role;
  imagePath?: string;
  posts: Post[];
}
