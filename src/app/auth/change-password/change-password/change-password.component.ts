import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject } from '@angular/core';
import { AuthService } from '../../auth.service';
import { finalize, tap } from 'rxjs';
import { CardComponent } from '../../../shared/components/card/card.component';
import { CardTitleDirective } from '../../../shared/components/card/card-title.directive';
import { CardContentDirective } from '../../../shared/components/card/card-content.directive';
import { IconComponent } from '../../../shared/components/icon/icon.component';
import { CardActionsDirective } from '../../../shared/components/card/card-actions.directive';
import { ButtonComponent } from '../../../shared/components/button/button.component';

@Component({
  selector: 'bio-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'center-container' },
  imports: [
    CardComponent,
    CardTitleDirective,
    CardContentDirective,
    IconComponent,
    CardActionsDirective,
    ButtonComponent,
  ],
})
export class ChangePasswordComponent {
  private authService = inject(AuthService);
  private changeDetectorRef = inject(ChangeDetectorRef);


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
