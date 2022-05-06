import { map, Observable, switchMap } from 'rxjs';
import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { User } from '../models/user.class';
import { AuthService } from '../services/auth.service';
import { JwtGuard } from '../guards/jwt.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(JwtGuard)
  @Post('register')
  register(@Body() user: User): Observable<User> {
    return this.authService.registerAccount(user);
  }

  @Post('login')
  login(@Body() user: User): Observable<{ token: string }> {

    return this.authService
      .login(user)
      .pipe(map((token: string) => ({ token })));
  }
}
