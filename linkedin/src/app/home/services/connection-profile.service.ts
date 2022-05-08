import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { User } from '../../auth/models/user.model';
import { FriendRequest, FriendRequestStatus } from './../models/FriendRequest';

@Injectable({
  providedIn: 'root',
})
export class ConnectionProfileService {
  private httpOptions: { headers: HttpHeaders } = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
  };

  constructor(private http: HttpClient) {}

  getConnectionUser(id: number): Observable<User> {
    return this.http.get<User>(
      `${environment.apiUrl}/user/${id}`,
      this.httpOptions
    );
  }

  getFriendRequestStatus(id: number): Observable<FriendRequestStatus> {
    return this.http.get<FriendRequestStatus>(
      `${environment.apiUrl}/user/friend-request/status/${id}`,
      this.httpOptions
    );
  }

  sendFriendRequest(recieverId: number): Observable<FriendRequest> {
    return this.http.post<FriendRequest>(
      `${environment.apiUrl}/user/friend-request/send/${recieverId}`,
      {}
    );
  }
}
