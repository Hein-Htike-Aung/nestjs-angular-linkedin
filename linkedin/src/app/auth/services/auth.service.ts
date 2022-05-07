import { UserResponse } from './../models/userResponse.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, from, Observable, of } from 'rxjs';
import { NewUser } from './../models/newUser.model';
import { Injectable } from '@angular/core';
import { Role, User } from '../models/user.model';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { map, switchMap, take, tap } from 'rxjs/operators';
import { Storage } from '@capacitor/storage';

import jwt_decode from 'jwt-decode';

const API_URL = `${environment.apiUrl}/auth`;

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private user$ = new BehaviorSubject<User>(null);

  private httpOptions: { headers: HttpHeaders } = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
  };

  constructor(private http: HttpClient, private rounter: Router) {}

  register(newUser: NewUser): Observable<User> {
    return this.http
      .post<User>(`${API_URL}/register`, newUser, this.httpOptions)
      .pipe(take(1));
  }

  login(email: string, password: string): Observable<{ token: string }> {
    return this.http
      .post<{ token: string }>(
        `${API_URL}/login`,
        { email, password },
        this.httpOptions
      )
      .pipe(
        take(1),
        tap((response: { token: string }) => {
          Storage.set({
            key: 'token',
            value: response.token,
          });

          const decodedToken: UserResponse = jwt_decode(response.token);

          this.user$.next(decodedToken.user);
        })
      );
  }

  // To make access the website if the stored token is available
  isTokenInStorage(): Observable<boolean> {
    return from(Storage.get({ key: 'token' })).pipe(
      map((data: { value: string }) => {
        if (!data || !data.value) return null;

        const decodedToken: UserResponse = jwt_decode(data.value);

        // check token expiration
        const jwtExpirationInMsSinceUnixEpoch = decodedToken.exp * 1000;

        const isExpired =
          new Date() > new Date(jwtExpirationInMsSinceUnixEpoch);

        if (isExpired) return null;

        // if the token is available, set user into BehaviorSubject
        if (decodedToken.user) {
          this.user$.next(decodedToken.user);
          return true;
        }
      })
    );
  }

  logout(): void {
    this.user$.next(null);
    Storage.remove({ key: 'token' });
    this.rounter.navigateByUrl('/auth');
  }

  updateUserImagePath(imagePath: string): Observable<User> {
    return this.userStream.pipe(
      take(1),
      map((user: User) => {
        user.imagePath = imagePath;
        this.user$.next(user);

        return user;
      })
    );
  }

  uploadUserImage(
    formData: FormData
  ): Observable<{ modifiedFileName: string }> {
    return this.http
      .post<{ modifiedFileName: string }>(`${API_URL}/upload`, formData)
      .pipe(
        tap(({ modifiedFileName }) => {
          // Change User Behaviour Subject
          let user = this.user$.value;
          user.imagePath = modifiedFileName;
          this.user$.next(user);
        })
      );
  }

  getDefualtImagePath(): string {
    return `${API_URL}/feed/image/default-image.png`;
  }

  getImagePath(imageName: string): string {
    return `${API_URL}/feed/image/${imageName}`;
  }

  getLoggedInUserActualImage() {
    return this.http.get(`${API_URL}/image`).pipe(take(1));
  }

  getLoggedInUserImageName(): Observable<{ imageName: string }> {
    return this.http
      .get<{ imageName: string }>(`${API_URL}/image-name`)
      .pipe(take(1));
  }

  get isUserLoggedIn(): Observable<boolean> {
    return this.user$.asObservable().pipe(
      switchMap((user: User) => {
        return of(user !== null);
      })
    );
  }

  get userRole(): Observable<Role> {
    return this.user$.asObservable().pipe(
      switchMap((user: User) => {
        if (user) {
          return of(user.role);
        }
      })
    );
  }

  get userId(): Observable<number> {
    return this.user$.asObservable().pipe(
      switchMap((user: User) => {
        if (user) {
          return of(user.id);
        }
      })
    );
  }

  get userStream(): Observable<User> {
    return this.user$.asObservable().pipe(take(1));
  }

  get userFullName(): Observable<string> {
    return this.user$
      .asObservable()
      .pipe(
        switchMap((user: User) => of(user.firstName + ' ' + user.lastName))
      );
  }

  get userProfileImagePath(): Observable<string> {
    return this.user$.asObservable().pipe(
      switchMap((user: User) => {
        const doesAuthorHaveImage = !!user?.imagePath;

        let fullImagePath = this.getDefualtImagePath();

        if (doesAuthorHaveImage) {
          fullImagePath = this.getImagePath(user?.imagePath);
        }

        return of(fullImagePath);
      })
    );
  }
}
