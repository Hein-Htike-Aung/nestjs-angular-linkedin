import { PostService } from './../../services/post.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { IonInfiniteScroll } from '@ionic/angular';
import { Post } from '../../models/Post';

@Component({
  selector: 'app-all-posts',
  templateUrl: './all-posts.component.html',
  styleUrls: ['./all-posts.component.scss'],
})
export class AllPostsComponent implements OnInit {
  @ViewChild(IonInfiniteScroll) ionInfiniteScroll: IonInfiniteScroll;

  queryParams: string;
  allLoadedPosts: Post[] = [];
  numberOfPosts = 5;
  skipPosts = 0;

  constructor(private postService: PostService) {}

  ngOnInit(): void {
    this.getPosts(false, '');
  }

  getPosts(isInitialLoad: boolean, event) {
    if (this.skipPosts === 20) {
      event.target.disabled = true;
    }
    this.queryParams = `?take=${this.numberOfPosts}&skips=${this.skipPosts}`;

    this.postService.getSelectedPosts(this.queryParams).subscribe(
      (posts: Post[]) => {
        this.allLoadedPosts = posts;

        if (isInitialLoad) event.target.complete;

        this.skipPosts += 5;
      },
      (error) => {
        console.log(error);
      }
    );
  }

  loadData(event) {
    this.getPosts(true, event);
  }
}
