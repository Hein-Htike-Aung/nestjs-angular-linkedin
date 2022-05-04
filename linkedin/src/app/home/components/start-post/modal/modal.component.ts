import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss']
})
export class ModalComponent implements OnInit {

  postForm: FormGroup;

  constructor(public modalController: ModalController, private builder: FormBuilder) { }

  ngOnInit(): void {
    this.postForm = this.builder.group({
      body: ['', Validators.required]
    })
  }

  onPost() {
    if (this.postForm.invalid) return;

    const body = this.postForm.value['body'];
    this.modalController.dismiss(
      {
        post: {
          body,
          createdAt: new Date(),

        }
      },
      'post'
    )
  }

  onDismiss() {
    this.modalController.dismiss(null, 'dismiss');
  }
}
