import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject } from '@angular/core';
import {
  Control,
  ControlGroup,
  Validators,
  StControlModule,
  StControlCommonModule,
  StControlValueModule,
} from '@stlmpp/control';
import { ContactSendMail } from '@model/contact';
import { ContactService } from './contact.service';
import { finalize, tap } from 'rxjs';
import { Router } from '@angular/router';
import { SnackBarService } from '@shared/components/snack-bar/snack-bar.service';
import { catchAndThrow } from '@util/operators/catch-and-throw';
import { HttpStatusCode } from '@angular/common/http';
import { DialogService } from '@shared/components/modal/dialog/dialog.service';
import { AuthQuery } from '../auth/auth.query';
import { CardComponent } from '../shared/components/card/card.component';
import { CardTitleDirective } from '../shared/components/card/card-title.directive';
import { CardSubtitleDirective } from '../shared/components/card/card-subtitle.directive';
import { CardContentDirective } from '../shared/components/card/card-content.directive';
import { FormFieldComponent } from '../shared/components/form/form-field.component';
import { InputDirective } from '../shared/components/form/input.directive';
import { FormFieldErrorsDirective } from '../shared/components/form/errors.directive';
import { FormFieldErrorComponent } from '../shared/components/form/error.component';
import { FormFieldHintDirective } from '../shared/components/form/hint.directive';
import { TextareaDirective } from '../shared/components/form/textarea.directive';
import { CdkTextareaAutosize } from '@angular/cdk/text-field';
import { CardActionsDirective } from '../shared/components/card/card-actions.directive';
import { ButtonComponent } from '../shared/components/button/button.component';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'bio-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    StControlModule,
    StControlCommonModule,
    CardComponent,
    CardTitleDirective,
    CardSubtitleDirective,
    CardContentDirective,
    FormFieldComponent,
    InputDirective,
    StControlValueModule,
    FormFieldErrorsDirective,
    FormFieldErrorComponent,
    FormFieldHintDirective,
    TextareaDirective,
    CdkTextareaAutosize,
    CardActionsDirective,
    ButtonComponent,
    AsyncPipe,
  ],
})
export class ContactComponent {
  private contactService = inject(ContactService);
  private router = inject(Router);
  private snackBarService = inject(SnackBarService);
  private dialogService = inject(DialogService);
  private authQuery = inject(AuthQuery);
  private changeDetectorRef = inject(ChangeDetectorRef);

  readonly mail = 'support@biomercs.net';
  readonly subject = 'Give me a good subject';
  readonly body = 'Describe your question(s) or suggestion(s)';
  readonly mailto = encodeURI(`mailto:${this.mail}?subject=${this.subject}&body=${this.body}`);

  readonly form = new ControlGroup<ContactSendMail>({
    body: new Control('', [
      Validators.required,
      Validators.maxLength(2000),
      Validators.minLength(1),
      Validators.whiteSpace,
    ]),
    subject: new Control('', {
      validators: [Validators.required, Validators.maxLength(200), Validators.minLength(1), Validators.whiteSpace],
      initialFocus: this.authQuery.getIsLogged(),
    }),
    from: new Control(this.authQuery.getUser()?.email ?? '', {
      validators: [Validators.required, Validators.email],
      initialFocus: !this.authQuery.getIsLogged(),
    }),
  });

  readonly subjectControlValue$ = this.form.get('subject').value$;
  readonly bodyControlValue$ = this.form.get('body').value$;
  sending = false;

  onSubmit(): void {
    if (this.form.invalid) {
      return;
    }
    this.sending = true;
    const dto = this.form.value;
    this.form.disable();
    this.contactService
      .sendMail(dto)
      .pipe(
        finalize(() => {
          this.sending = false;
          this.changeDetectorRef.markForCheck();
          this.form.enable();
        }),
        tap(() => {
          this.router.navigate(['/']).then();
          this.snackBarService.open('Your message was sent successfully!');
        }),
        catchAndThrow(err => {
          if (err.status === HttpStatusCode.TooManyRequests) {
            this.dialogService.error({ title: 'Sorry', content: err.message, buttons: ['Ok'] }).then();
          }
        })
      )
      .subscribe();
  }
}
