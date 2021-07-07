import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Control, ControlGroup, Validators } from '@stlmpp/control';
import { ContactSendMail } from '@model/contact';
import { LocalState } from '@stlmpp/store';
import { ContactService } from './contact.service';
import { finalize, tap } from 'rxjs';
import { Router } from '@angular/router';
import { SnackBarService } from '@shared/components/snack-bar/snack-bar.service';
import { catchAndThrow } from '@util/operators/catch-and-throw';
import { HttpStatusCode } from '@angular/common/http';
import { DialogService } from '@shared/components/modal/dialog/dialog.service';
import { AuthQuery } from '../auth/auth.query';

interface ContactComponentState {
  sending: boolean;
}

@Component({
  selector: 'bio-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContactComponent extends LocalState<ContactComponentState> {
  constructor(
    private contactService: ContactService,
    private router: Router,
    private snackBarService: SnackBarService,
    private dialogService: DialogService,
    private authQuery: AuthQuery
  ) {
    super({ sending: false });
  }

  mail = 'support@biomercs.net';
  subject = 'Give me a good subject';
  body = 'Describe your question(s) or suggestion(s)';
  mailto = encodeURI(`mailto:${this.mail}?subject=${this.subject}&body=${this.body}`);

  form = new ControlGroup<ContactSendMail>({
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

  subjectControlValue$ = this.form.get('subject').value$;
  bodyControlValue$ = this.form.get('body').value$;
  sending$ = this.selectState('sending');

  onSubmit(): void {
    if (this.form.invalid) {
      return;
    }
    this.updateState({ sending: true });
    const dto = this.form.value;
    this.form.disable();
    this.contactService
      .sendMail(dto)
      .pipe(
        finalize(() => {
          this.updateState({ sending: false });
          this.form.enable();
        }),
        tap(() => {
          this.router.navigate(['/']).then();
          this.snackBarService.open('Your message was sent successfully!');
        }),
        catchAndThrow(err => {
          if (err.status === HttpStatusCode.TooManyRequests) {
            this.dialogService.error({ title: 'Sorry', content: err.message, btnNo: null, btnYes: 'Ok' }).then();
          }
        })
      )
      .subscribe();
  }
}
