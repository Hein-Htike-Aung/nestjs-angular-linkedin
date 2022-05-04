import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Post } from '../models/Post';

const API = `${environment.apiUrl}/feed`;

@Injectable({
  providedIn: 'root',
})
export class PostService {
  constructor(private http: HttpClient) {}

  getSelectedPosts(params) {
    return this.http.get<Post[]>(`${API}${params}`);
  }
}
