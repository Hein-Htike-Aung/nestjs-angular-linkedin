import { BannerColorService } from './../../services/banner-color.service';
import { FormGroup, FormBuilder } from '@angular/forms';
import { AuthService } from './../../../auth/services/auth.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { take, switchMap } from 'rxjs/operators';
import { Role } from '../../../auth/models/user.model';
import { BehaviorSubject, from, of, Subscription } from 'rxjs';
import { FileTypeResult } from 'file-type';
import { fromBuffer } from 'file-type/core';

type validFileExtension = 'png' | 'jpg' | 'jpeg';
type validMimeType = 'image/png' | 'image/jpg' | 'image/jpeg';

@Component({
  selector: 'app-profile-summary',
  templateUrl: './profile-summary.component.html',
  styleUrls: ['./profile-summary.component.scss'],
})
export class ProfileSummaryComponent implements OnInit, OnDestroy {
  form!: FormGroup;

  validFileExtensions: validFileExtension[] = ['png', 'jpg', 'jpeg'];

  validMimeTypes: validMimeType[] = ['image/png', 'image/jpg', 'image/jpeg'];

  userFullImagePath: string;
  private userImagePathScription: Subscription;

  fullName$ = new BehaviorSubject<string>(null);
  fullName = '';

  constructor(
    private authService: AuthService,
    private builder: FormBuilder,
    public bannerColorService: BannerColorService
  ) {}

  ngOnInit(): void {
    this.form = this.builder.group({
      file: null,
    });

    this.authService.userRole.pipe(take(1)).subscribe((role: string) => {
      this.bannerColorService.bannerColors =
        this.bannerColorService.getBannerColors(role as Role);
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

  onFileSelect(event: any) {
    const file: File = (event.target as HTMLInputElement).files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    from(file.arrayBuffer())
      .pipe(
        switchMap((buffer: Buffer) => {
          return from(fromBuffer(buffer)).pipe(
            switchMap((fileTypeResult: FileTypeResult) => {
              if (!fileTypeResult) {
                // TODO: error handling
                console.log({ error: 'file format not supported!' });
                return of();
              }
              const { ext, mime } = fileTypeResult;
              const isFileTypeLegit = this.validFileExtensions.includes(
                ext as any
              );
              const isMimeTypeLegit = this.validMimeTypes.includes(mime as any);
              const isFileLegit = isFileTypeLegit && isMimeTypeLegit;
              if (!isFileLegit) {
                // TODO: error handling
                console.log({
                  error: 'file format does not match file extension!',
                });
                return of();
              }
              return this.authService.uploadUserImage(formData);
            })
          );
        })
      )
      .subscribe();

    this.form.reset();
  }
}
