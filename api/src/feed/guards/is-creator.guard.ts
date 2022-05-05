import { UserService } from './../../auth/services/user.service';
import { FeedPost } from './../models/post.interface';
import { User } from './../../auth/models/user.interface';
import { FeedService } from './../services/feed.service';
import { AuthService } from './../../auth/services/auth.service';
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable, of, switchMap, map, filter, tap } from 'rxjs';

@Injectable()
export class IsCreatorGuard implements CanActivate {
  constructor(
    private userService: UserService,
    private feedService: FeedService,
  ) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();

    const { user, params }: { user: User; params: { id: number } } = request;

    if (!user || !params) return false;

    if (user.role === 'ADMIN') return true;

    const userId = user.id;
    const feedId = +params.id;

    return this.userService
      .findUserById(userId)
      .pipe(
        switchMap((user: User) =>
          this.feedService
            .findPostById(feedId)
            .pipe(map((feedPost: FeedPost) => user.id === feedPost.author.id)),
        ),
      );
  }
}
