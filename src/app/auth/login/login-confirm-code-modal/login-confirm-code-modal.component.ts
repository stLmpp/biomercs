import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { ControlBuilder, Validators } from '@stlmpp/control';
import { ModalRef } from '@shared/components/modal/modal-ref';
import { MODAL_DATA } from '@shared/components/modal/modal.config';
import { AuthService } from '../../auth.service';
import { finalize, tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { catchAndThrow } from '@util/operators/catchError';
import { StateComponent } from '@shared/components/common/state-component';

interface LoginConfirmationForm {
  code: number | null;
}

@Component({
  selector: 'bio-login-confirm-code-modal',
  templateUrl: './login-confirm-code-modal.component.html',
  styleUrls: ['./login-confirm-code-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginConfirmCodeModalComponent extends StateComponent<{ loading: boolean; error: string | null }> {
  constructor(
    public modalRef: ModalRef<LoginConfirmCodeModalComponent, number>,
    private controlBuilder: ControlBuilder,
    @Inject(MODAL_DATA) private idUser: number,
    private authService: AuthService,
    private router: Router
  ) {
    super({ loading: false, error: null });
  }

  form = this.controlBuilder.group<LoginConfirmationForm>({ code: [null, [Validators.required]] });
  loading$ = this.selectState('loading');
  error$ = this.selectState('error');

  submit(): void {
    if (this.form.invalid) {
      return;
    }
    this.updateState({ error: null, loading: true });
    this.form.disable();
    const { code } = this.form.value;
    // Code has to be set at this point because of validations
    this.authService
      .confirmCode(this.idUser, code!)
      .pipe(
        finalize(() => {
          this.updateState('loading', false);
          this.form.enable();
        }),
        tap(() => {
          this.modalRef.close();
          this.router.navigate(['/']).then();
        }),
        catchAndThrow(err => {
          this.updateState('error', err.message);
        })
      )
      .subscribe();
  }
}
