import { AuthService } from './../../../auth/services/auth.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { PopoverController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { PopoverComponent } from './popover/popover.component';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit, OnDestroy {
  userFullImagePath: string;
  private userImagePathScription: Subscription;

  constructor(
    public popoverController: PopoverController,
    private authService: AuthService
  ) {}

  ngOnInit() {
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

  async presentPopover(ev: any) {
    const popover = await this.popoverController.create({
      component: PopoverComponent,
      cssClass: 'profile-popover',
      event: ev,
      showBackdrop: false,
    });
    await popover.present();

    const { role } = await popover.onDidDismiss();
    console.log('onDidDismiss resolved with role', role);
  }
}
