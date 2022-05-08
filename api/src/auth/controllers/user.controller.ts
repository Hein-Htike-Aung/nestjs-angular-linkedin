import { isFileExtensionSafe, removeFile } from './../helpers/image-storage';
import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Request,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { join } from 'path';
import { of, Observable, map, switchMap } from 'rxjs';
import { saveImageToStorage } from '../helpers/image-storage';
import { JwtGuard } from './../guards/jwt.guard';
import { UserService } from './../services/user.service';
import { UpdateResult } from 'typeorm';
import {
  FriendRequest,
  FriendRequestStatus,
} from '../models/friend-request.interface';
import { FriendRequestEntity } from '../models/friend-request.entity';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @UseGuards(JwtGuard)
  @Post('upload')
  @UseInterceptors(FileInterceptor('file', saveImageToStorage))
  updateImage(
    @UploadedFile() file: Express.Multer.File,
    @Request() req,
  ): Observable<{ modifiedFileName: string } | { error: string }> {
    const fileName = file?.filename;

    if (!fileName) return of({ error: 'File must be a png, jpg/jpeg' });

    const imagesFolderPath = join(process.cwd(), `images`);
    const fullImagePath = join(imagesFolderPath + '/', file.filename);

    return isFileExtensionSafe(fullImagePath).pipe(
      switchMap((isFileLegit: boolean) => {
        if (isFileLegit) {
          const userId = req.user.id;

          return this.userService.updateUserImageById(userId, fileName).pipe(
            map(() => ({
              modifiedFileName: file.filename,
            })),
          );
        }
        // invalid file
        removeFile(fullImagePath);
        return of({ error: `File content doesn't match extension` });
      }),
    );
  }

  // Logged In User's Actual Image
  @UseGuards(JwtGuard)
  @Get('image')
  findImage(@Request() req, @Res() res): Observable<Object> {
    const userId = req.user.id;

    return this.userService.findImageNameUserId(userId).pipe(
      switchMap((imageName: string) => {
        return of(res.sendFile(imageName, { root: './images' }));
      }),
    );
  }

  // Logged In User's Image Name
  @UseGuards(JwtGuard)
  @Get('image-name')
  findUserImageName(@Request() req): Observable<{ imageName: string }> {
    const userId = req.user.id;

    return this.userService.findImageNameUserId(userId).pipe(
      switchMap((imageName: string) => {
        return of({ imageName });
      }),
    );
  }

  @UseGuards(JwtGuard)
  @Get(':userId')
  findUserByUserId(@Param('userId') userStringId: string): Observable<Object> {
    const userId = parseInt(userStringId);
    return this.userService.findUserById(userId);
  }

  @UseGuards(JwtGuard)
  @Post('friend-request/send/:receiverId')
  sendFriendRequest(
    @Param('receiverId') receiverStringId: string,
    @Request() req,
  ): Observable<FriendRequest | { error: string }> {
    const receiverId = parseInt(receiverStringId);
    return this.userService.sendFriendRequest(receiverId, req.user);
  }

  @UseGuards(JwtGuard)
  @Get('friend-request/status/:receiverId')
  getFriendRequestStatus(
    @Param('receiverId') receiverStringId: string,
    @Request() req,
  ): Observable<{ status: string }> {
    const receiverId = parseInt(receiverStringId);

    return this.userService.getFriendRequestStatus(receiverId, req.user);
  }

  @UseGuards(JwtGuard)
  @Patch('friend-request/response/:friendRequestId')
  resposneToFriendRequest(
    @Param('friendRequestId') friendRequestStringId: string,
    @Body() statusResponse: FriendRequestStatus,
  ): Observable<{ status: string }> {
    const friendRequestId = parseInt(friendRequestStringId);

    return this.userService.resposneToFriendRequest(
      friendRequestId,
      statusResponse,
    );
  }

  @UseGuards(JwtGuard)
  @Get('friend-request/me/received-requests')
  getFriendRequestsFromRecipients(
    @Request() req,
  ): Observable<FriendRequestEntity[]> {
    return this.userService.getFriendRequestsFromRecipients(req.user);
  }
}
