import { PostService } from './services/post.service';
import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  body = '';

  constructor(private postService: PostService) {}

  onCreate(postBody: string) {
    this.body = postBody;
  }
}
