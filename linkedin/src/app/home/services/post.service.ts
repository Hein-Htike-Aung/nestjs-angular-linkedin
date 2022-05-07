import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Post } from '../models/Post';
import { take } from 'rxjs/operators';

const API_URL = `${environment.apiUrl}/feed`;

@Injectable({
  providedIn: 'root',
})
export class PostService {
  private httpOptions: { headers: HttpHeaders } = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
  };

  constructor(private http: HttpClient) {}

  getSelectedPosts(params) {
    return this.http.get<Post[]>(`${API_URL}${params}`);
  }

  createPost(body: string): Observable<Post> {
    return this.http
      .post<Post>(`${API_URL}`, { body }, this.httpOptions)
      .pipe(take(1));
  }

  updatePost(postId: number, body: string) {
    return this.http
      .patch(`${API_URL}/${postId}`, { body }, this.httpOptions)
      .pipe(take(1));
  }

  delete(postId: number) {
    return this.http.delete(`${API_URL}/${postId}`).pipe(take(1));
  }
}
