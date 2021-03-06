import { AuthService } from './../../../../auth/services/auth.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { BehaviorSubject, Subscription } from 'rxjs';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-popover',
  templateUrl: './popover.component.html',
  styleUrls: ['./popover.component.scss'],
})
export class PopoverComponent implements OnInit, OnDestroy {

  userFullImagePath: string;
  private userImagePathScription: Subscription;

  fullName$ = new BehaviorSubject<string>(null);
  fullName = '';


  constructor(private authService: AuthService) {}

  ngOnInit() {

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

  onSignOut() {
    this.authService.logout();
  }
}
