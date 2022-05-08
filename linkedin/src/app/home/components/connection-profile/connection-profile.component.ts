import { map, switchMap, tap, take } from 'rxjs/operators';
import { Observable, Subscription } from 'rxjs';
import { ConnectionProfileService } from './../../services/connection-profile.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, UrlSegment } from '@angular/router';
import { BannerColorService } from '../../services/banner-color.service';
import { User } from '../../../auth/models/user.model';
import {
  FriendRequestStatus,
  FriendRequest_Status_Type,
} from '../../models/FriendRequest';

@Component({
  selector: 'app-connection-profile',
  templateUrl: './connection-profile.component.html',
  styleUrls: ['./connection-profile.component.scss'],
})
export class ConnectionProfileComponent implements OnInit, OnDestroy {
  user: User;
  friendRequestStatus: FriendRequest_Status_Type;
  friendRequestStatusSub$: Subscription;
  userSub$: Subscription;

  constructor(
    private connectionProfileService: ConnectionProfileService,
    public bannerColorService: BannerColorService,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit() {
    this.friendRequestStatusSub$ = this.getFriendRequestStatus()
      .pipe(
        tap((friendRequestStatus: FriendRequestStatus) => {
          this.friendRequestStatus = friendRequestStatus.status;

          this.userSub$ = this.getUser().subscribe((user: User) => {
            this.user = user;
            const imgPath = user.imagePath ?? 'default-image.png';

            this.user['fullImagePath'] =
              'http://localhost:3000/api/feed/image/' + imgPath;
          });
        })
      )
      .subscribe();
  }

  ngOnDestroy(): void {
    this.friendRequestStatusSub$.unsubscribe();
    this.userSub$.unsubscribe();
  }

  addUser() {
    // Change Friend Request Status
    this.friendRequestStatus = 'pending';

    this.getUserIdFromUrl()
      .pipe(
        switchMap((userId: number) => {
          return this.connectionProfileService.sendFriendRequest(userId);
        }),
        take(1)
      )
      .subscribe();
  }

  getUser(): Observable<User> {
    return this.getUserIdFromUrl().pipe(
      switchMap((id: number) => {
        return this.connectionProfileService.getConnectionUser(id);
      })
    );
  }

  getFriendRequestStatus(): Observable<FriendRequestStatus> {
    return this.getUserIdFromUrl().pipe(
      switchMap((userId: number) => {
        return this.connectionProfileService.getFriendRequestStatus(userId);
      })
    );
  }

  private getUserIdFromUrl(): Observable<number> {
    return this.activatedRoute.url.pipe(
      map((urlSegment: UrlSegment[]) => {
        return +urlSegment[0].path;
      })
    );
  }
}
