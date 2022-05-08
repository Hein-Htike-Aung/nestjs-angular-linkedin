import { PostService } from './../home/services/post.service';
import { Router } from '@angular/router';
import { NewUser } from './models/newUser.model';
import { AuthService } from './services/auth.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.page.html',
  styleUrls: ['./auth.page.scss'],
})
export class AuthPage implements OnInit {
  @ViewChild('form') form: NgForm;

  submissionType: 'login' | 'join' = 'login';

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {}

  onSubmit() {
    this.form.value.firstName;
    const { email, password } = this.form.value;

    if (!email || !password) return;

    if (this.submissionType === 'login') {
      this.authService.login(email, password).subscribe({
        next: () => {
          this.router.navigateByUrl('/home');
        },
      });
    } else if (this.submissionType === 'join') {
      const { firstName, lastName } = this.form.value;
      if (!firstName || !lastName) return;

      const newUser: NewUser = { firstName, lastName, email, password };

      this.authService.register(newUser).subscribe(() => {
        this.toogleText();
      });
    }
  }

  toogleText() {
    if (this.submissionType === 'login') {
      this.submissionType = 'join';
    } else if (this.submissionType === 'join') {
      this.submissionType = 'login';
    }
  }
}
