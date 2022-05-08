import { AuthService } from './../../../../auth/services/auth.service';
import { Component, Input, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { BehaviorSubject, Subscription } from 'rxjs';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss'],
})
export class ModalComponent implements OnInit, OnDestroy {
  postForm: FormGroup;

  userFullImagePath: string;
  private userImagePathScription: Subscription;
  
  fullName$ = new BehaviorSubject<string>(null);
  fullName = '';

  // Edit
  @Input() postId?: number;

  constructor(
    public modalController: ModalController,
    private builder: FormBuilder,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.postForm = this.builder.group({
      body: ['', Validators.required],
    });
    
    this.authService.userFullName
    .pipe(take(1))
    .subscribe((fullName: string) => {
      this.fullName = fullName;
      this.fullName$.next(fullName);
    });

    this.userImagePathScription =
      this.authService.userProfileImagePath.subscribe(
        (fullImagePath: string) => {
          this.userFullImagePath = fullImagePath;
        }
      );
  }

  ngOnDestroy(): void {
    this.userImagePathScription.unsubscribe();
  }

  onPost() {
    if (this.postForm.invalid) return;

    const body = this.postForm.value['body'];
    this.modalController.dismiss(
      {
        post: {
          body,
          createdAt: new Date(),
        },
      },
      'post'
    );
  }

  onDismiss() {
    this.modalController.dismiss(null, 'dismiss');
  }
}
