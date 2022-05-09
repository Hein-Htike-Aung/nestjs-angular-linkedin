import { Component, OnInit } from '@angular/core';
import { PopoverController } from '@ionic/angular';
import { take, tap } from 'rxjs/operators';
import { User } from 'src/app/auth/models/user.model';
import { FriendRequest } from './../../../models/FriendRequest';
import { ConnectionProfileService } from './../../../services/connection-profile.service';

@Component({
  selector: 'app-friend-requests-popover',
  templateUrl: './friend-requests-popover.component.html',
  styleUrls: ['./friend-requests-popover.component.scss'],
})
export class FriendRequestsPopoverComponent implements OnInit {
  constructor(
    public connectionProfileService: ConnectionProfileService,
    private popoverController: PopoverController
  ) {}

  ngOnInit() {
    this.connectionProfileService.friendRequests.map(
      (friendRequest: FriendRequest) => {
        const creatorId = (friendRequest as any)?.creator?.id;

        if (friendRequest && creatorId) {
          this.connectionProfileService
            .getConnectionUser(creatorId)
            .pipe(
              take(1),
              tap((user: User) => {
                // Set Creator full image path
                friendRequest['fullImagePath'] =
                  'http://localhost:3000/api/feed/image/' +
                  (user?.imagePath || 'default-image.png');
              })
            )
            .subscribe();
        }
      }
    );
  }

  async responseToFriendRequest(
    id: number,
    statusResponse: 'accepted' | 'declined'
  ) {
    const handledFriendRequest: FriendRequest =
      this.connectionProfileService.friendRequests.find(
        (friendRequest) => friendRequest.id === id
      );

    const unHandledFriendRequests: FriendRequest[] =
      this.connectionProfileService.friendRequests.filter(
        (friendRequest) => friendRequest.id !== handledFriendRequest.id
      );

    // Refresh FriendRequest List
    this.connectionProfileService.friendRequests = unHandledFriendRequests;

    if (this.connectionProfileService?.friendRequests.length == 0) {
      await this.popoverController.dismiss();
    }

    return this.connectionProfileService
      .respondToFriendRequest(id, statusResponse)
      .pipe(take(1))
      .subscribe();
  }
}