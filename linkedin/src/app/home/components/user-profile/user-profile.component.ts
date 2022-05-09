import { Component, OnInit } from '@angular/core';
import { PostService } from '../../services/post.service';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss'],
})
export class UserProfileComponent implements OnInit {

  body = '';

  constructor(private postService: PostService) {}

  ngOnInit(): void {
    
  }

  onCreate(postBody: string) {
    this.body = postBody;
  }
}
