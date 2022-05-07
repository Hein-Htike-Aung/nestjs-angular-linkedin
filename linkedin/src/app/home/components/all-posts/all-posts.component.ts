import { AuthService } from './../../../auth/services/auth.service';
import { BehaviorSubject } from 'rxjs';
import { PostService } from './../../services/post.service';
import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { IonInfiniteScroll, ModalController } from '@ionic/angular';
import { Post } from '../../models/Post';
import { take } from 'rxjs/operators';
import { ModalComponent } from '../start-post/modal/modal.component';

@Component({
  selector: 'app-all-posts',
  templateUrl: './all-posts.component.html',
  styleUrls: ['./all-posts.component.scss'],
})
export class AllPostsComponent implements OnInit, OnChanges {
  @Input() postBody?: string;

  @ViewChild(IonInfiniteScroll) ionInfiniteScroll: IonInfiniteScroll;

  queryParams: string;
  allLoadedPosts: Post[] = [];
  numberOfPosts = 5;
  skipPosts = 0;

  userId$ = new BehaviorSubject<number>(null);

  constructor(
    private postService: PostService,
    private authService: AuthService,
    public modalController: ModalController
  ) {}

  ngOnInit(): void {
    this.getPosts(false, '');

    this.authService.userId
      .pipe(take(1))
      .subscribe((userId: number) => this.userId$.next(userId));
  }

  ngOnChanges(changes: SimpleChanges): void {
    // Create Post
    const postBody = changes?.postBody?.currentValue;
    if (!postBody) return;

    this.postService
      .createPost(postBody)
      .subscribe((post: Post) => this.allLoadedPosts.unshift(post));
  }

  getPosts(isInitialLoad: boolean, event) {
    if (this.skipPosts === 20) {
      event.target.disabled = true;
    }
    this.queryParams = `?take=${this.numberOfPosts}&skip=${this.skipPosts}`;

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

  // Update Post
  async presenUpdateModel(postId: number) {
    const modal = await this.modalController.create({
      component: ModalComponent,
      cssClass: 'my-custom-class2',
      componentProps: {
        postId, // Received with @Input in Model
      },
    });
    await modal.present();
    const { data, role } = await modal.onDidDismiss();

    if (!data) return;

    const updatePost = data.post.body;

    this.postService.updatePost(postId, updatePost).subscribe(() => {
      const postIndex = this.allLoadedPosts.findIndex((p) => p.id === postId);

      this.allLoadedPosts[postIndex].body = updatePost;
    });
  }

  presenDeleteModel(postId: number) {
    this.postService.delete(postId).subscribe(() => {
      this.allLoadedPosts = this.allLoadedPosts.filter((p) => p.id !== postId);
    });
  }
}
