import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';
import { AuthService } from '../../auth.service';
import { finalize, tap } from 'rxjs';

@Component({
    selector: 'bio-change-password',
    templateUrl: './change-password.component.html',
    styleUrls: ['./change-password.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    host: { class: 'center-container' },
    standalone: false
})
export class ChangePasswordComponent {
  constructor(private authService: AuthService, private changeDetectorRef: ChangeDetectorRef) {}

  sendingEmail = false;
  sentEmail = false;

  sendEmail(): void {
    this.sendingEmail = true;
    this.authService
      .sendChangePasswordConfirmationCode()
      .pipe(
        tap(() => {
          this.sentEmail = true;
        }),
        finalize(() => {
          this.sendingEmail = false;
          this.changeDetectorRef.markForCheck();
        })
      )
      .subscribe();
  }
}
