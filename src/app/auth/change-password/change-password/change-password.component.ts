import { ChangeDetectionStrategy, Component } from '@angular/core';
import { LocalState } from '@stlmpp/store';
import { AuthService } from '../../auth.service';
import { tap } from 'rxjs';
import { catchAndThrow } from '@util/operators/catch-and-throw';

export interface ChangePasswordComponentState {
  sentEmail: boolean;
  sendingEmail: boolean;
}

@Component({
  selector: 'bio-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'center-container' },
})
export class ChangePasswordComponent extends LocalState<ChangePasswordComponentState> {
  constructor(private authService: AuthService) {
    super({ sendingEmail: false, sentEmail: false });
  }

  state$ = this.selectState();

  sendEmail(): void {
    this.updateState({ sendingEmail: true });
    this.authService
      .sendChangePasswordConfirmationCode()
      .pipe(
        tap(() => {
          this.updateState({ sendingEmail: false, sentEmail: true });
        }),
        catchAndThrow(() => {
          this.updateState({ sendingEmail: false });
        })
      )
      .subscribe();
  }
}
