import { AuthService } from './../../../auth/services/auth.service';
import { PostService } from './../../services/post.service';
import { Component, EventEmitter, OnInit, Output, OnDestroy } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ModalComponent } from './modal/modal.component';
import { BehaviorSubject, Subscription } from 'rxjs';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-start-post',
  templateUrl: './start-post.component.html',
  styleUrls: ['./start-post.component.scss'],
})
export class StartPostComponent implements OnInit, OnDestroy {
  @Output() create = new EventEmitter<any>();

  userFullImagePath: string;
  private userImagePathScription: Subscription;

  constructor(
    public modalController: ModalController,
    private postService: PostService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {

    this.userImagePathScription = this.authService.userProfileImagePath.subscribe(
      (fullImagePath: string) => {
        this.userFullImagePath = fullImagePath;
      }
    );
  }

  ngOnDestroy(): void {
    this.userImagePathScription.unsubscribe();
  }

  async presentModel() {
    const modal = await this.modalController.create({
      component: ModalComponent,
      cssClass: 'my-custom-class2',
    });
    await modal.present();
    const { data, role } = await modal.onDidDismiss();
    // console.log('role: ', role, 'data: ', data);

    if (!data) return;
    this.create.emit(data.post.body);
  }
}
