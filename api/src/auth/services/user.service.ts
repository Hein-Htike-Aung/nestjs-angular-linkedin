import { FriendRequestEntity } from './../models/friend-request.entity';
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { from, map, Observable, of, switchMap } from 'rxjs';
import { Repository, UpdateResult } from 'typeorm';
import {
  FriendRequest,
  FriendRequestStatus,
  FriendRequest_Status_Type,
} from '../models/friend-request.interface';
import { UserEntity } from '../models/user.entity';
import { User } from '../models/user.class';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(FriendRequestEntity)
    private readonly friendRequestRepository: Repository<FriendRequestEntity>,
  ) {}

  findUserById(id: number): Observable<User> {
    return from(
      this.userRepository.findOne({ where: { id }, relations: ['posts'] }),
    ).pipe(
      map((user: User) => {
        if (!user)
          throw new HttpException('User not found', HttpStatus.NOT_FOUND);

        delete user.password;
        return user;
      }),
    );
  }

  updateUserImageById(id: number, imagePath: string): Observable<UpdateResult> {
    const user: User = new UserEntity();
    user.id = id;
    user.imagePath = imagePath;

    return from(this.userRepository.update(id, user));
  }

  findImageNameUserId(id: number): Observable<string> {
    return from(this.userRepository.findOne({ where: { id } })).pipe(
      map((user: User) => user.imagePath),
    );
  }

  hasRequestBeenSentOrReceived(
    creator: User,
    receiver: User,
  ): Observable<boolean> {
    return from(
      this.friendRequestRepository.findOne({
        where: [
          { creator, receiver },
          { creator: receiver, receiver: creator },
        ],
      }),
    ).pipe(
      switchMap((friendRequest: FriendRequestEntity) => {
        if (!friendRequest) return of(false);
        return of(true);
      }),
    );
  }

  sendFriendRequest(
    receiverId: number,
    creator: User,
  ): Observable<FriendRequest | { error: string }> {
    if (receiverId === creator.id)
      return of({ error: 'It is not possible to add yourself!' });

    return this.findUserById(receiverId).pipe(
      switchMap((receiver: User) => {
        return this.hasRequestBeenSentOrReceived(creator, receiver).pipe(
          switchMap((hasRequestBeenSentOrReceived: boolean) => {
            if (hasRequestBeenSentOrReceived)
              return of({
                error:
                  'A friend request has already been sent of received to your account!',
              });
            let friendRequest: FriendRequest = {
              creator,
              receiver,
              status: 'pending',
            };
            return from(this.friendRequestRepository.save(friendRequest));
          }),
        );
      }),
    );
  }

  getFriendRequestStatus(
    receiverId: number,
    currentUser: User,
  ): Observable<FriendRequestStatus> {
    return this.findUserById(receiverId).pipe(
      switchMap((receiver: User) => {
        return from(
          this.friendRequestRepository.findOne({
            where: [
              {
                receiver: { id: receiver.id },
                creator: { id: currentUser.id },
              },
              {
                creator: { id: receiver.id },
                receiver: { id: currentUser.id },
              },
            ],
            relations: ['creator', 'receiver'],
          }),
        ).pipe(
          switchMap((friendRequest: any) => {
            if (friendRequest?.receiver.id === currentUser.id) {
              return of({
                status:
                  'waiting-for-current-user-response' as FriendRequest_Status_Type,
              });
            }
            return of({ status: friendRequest?.status || 'not-sent' });
          }),
        );
      }),
    );
  }
  getFriendRequestUserById(
    friendRequestId: number,
  ): Observable<FriendRequestEntity> {
    return from(
      this.friendRequestRepository.findOne({ where: { id: friendRequestId } }),
    );
  }

  resposneToFriendRequest(
    friendRequestId: number,
    statusResponse: FriendRequestStatus,
  ): Observable<{ status: string }> {
    return this.getFriendRequestUserById(friendRequestId).pipe(
      switchMap((friendRequest: FriendRequestEntity) => {
        return from(
          this.friendRequestRepository.save({
            ...friendRequest,
            status: statusResponse.status,
          }),
        );
      }),
    );
  }

  getFriendRequestsFromRecipients(
    currentUser: User,
  ): Observable<FriendRequestEntity[]> {
    return from(
      this.friendRequestRepository.find({
        where: { receiver: currentUser },
        relations: ['receiver', 'creator'],
      }),
    );
  }
}
