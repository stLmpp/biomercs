import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject } from '@angular/core';
import { ControlBuilder, Validators, StControlModule, StControlCommonModule } from '@stlmpp/control';
import { ModalRef } from '@shared/components/modal/modal-ref';
import { MODAL_DATA } from '@shared/components/modal/modal.config';
import { AuthService } from '../../auth.service';
import { finalize, tap } from 'rxjs';
import { Router } from '@angular/router';
import { catchAndThrow } from '@util/operators/catch-and-throw';
import { ModalTitleDirective } from '../../../shared/components/modal/modal-title.directive';
import { ModalContentDirective } from '../../../shared/components/modal/modal-content.directive';
import { ConfirmationCodeInputComponent } from '../../shared/confirmation-code-input/confirmation-code-input.component';
import { ModalActionsDirective } from '../../../shared/components/modal/modal-actions.directive';
import { ButtonComponent } from '../../../shared/components/button/button.component';

interface LoginConfirmationForm {
  code: number | null;
}

@Component({
  selector: 'bio-login-confirm-code-modal',
  templateUrl: './login-confirm-code-modal.component.html',
  styleUrls: ['./login-confirm-code-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    StControlModule,
    StControlCommonModule,
    ModalTitleDirective,
    ModalContentDirective,
    ConfirmationCodeInputComponent,
    ModalActionsDirective,
    ButtonComponent,
  ],
})
export class LoginConfirmCodeModalComponent {
  constructor(
    public modalRef: ModalRef<LoginConfirmCodeModalComponent, number>,
    private controlBuilder: ControlBuilder,
    @Inject(MODAL_DATA) private idUser: number,
    private authService: AuthService,
    private router: Router,
    private changeDetectorRef: ChangeDetectorRef
  ) {}

  readonly form = this.controlBuilder.group<LoginConfirmationForm>({ code: [null, [Validators.required]] });
  loading = false;
  error: string | null = null;

  submit(): void {
    if (this.form.invalid) {
      return;
    }
    this.error = null;
    this.loading = true;
    this.modalRef.disableClose = true;
    this.form.disable();
    const { code } = this.form.value;
    // Code has to be set at this point because of validations
    this.authService
      .confirmCode(this.idUser, code!)
      .pipe(
        tap(() => {
          this.modalRef.close();
          this.router.navigate(['/']).then();
        }),
        catchAndThrow(err => {
          this.error = err.message;
        }),
        finalize(() => {
          this.loading = false;
          this.modalRef.disableClose = false;
          this.changeDetectorRef.markForCheck();
          this.form.enable();
        })
      )
      .subscribe();
  }
}
