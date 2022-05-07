import { AuthService } from './../../../../auth/services/auth.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-popover',
  templateUrl: './popover.component.html',
  styleUrls: ['./popover.component.scss'],
})
export class PopoverComponent implements OnInit {
  constructor(private authService: AuthService) {}

  ngOnInit() {}

  onSignOut() {
    this.authService.logout();
  }
}
