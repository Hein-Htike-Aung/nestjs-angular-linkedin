import { PostService } from './../../services/post.service';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ModalComponent } from './modal/modal.component';

@Component({
  selector: 'app-start-post',
  templateUrl: './start-post.component.html',
  styleUrls: ['./start-post.component.scss'],
})
export class StartPostComponent implements OnInit {
  @Output() create = new EventEmitter<any>();

  constructor(
    public modalController: ModalController,
    private postService: PostService
  ) {}

  ngOnInit(): void {}

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
