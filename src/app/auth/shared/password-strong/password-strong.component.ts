import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

type ValidationFn = (password: string) => boolean;

@Component({
  selector: 'bio-password-strong',
  templateUrl: './password-strong.component.html',
  styleUrls: ['./password-strong.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PasswordStrongComponent {
  private _validations: ValidationFn[] = [
    password => /[A-Z]/.test(password),
    password => /[a-z]/.test(password),
    password => /[a-zA-Z]{2}/.test(password),
    password => /[a-zA-Z]{3}/.test(password),
    password => /[0-9]/.test(password),
    password => /[0-9]{2}/.test(password),
    password => /[0-9]{3}/.test(password),
    password => password.length > 6,
    password => password.length > 12,
    password => /\W|_/.test(password),
    password => /(\W|_){2}/.test(password),
  ];
  validationScore = 0;

  private _validatePassword(password: string): void {
    const score = this._validations.reduce((acc, validation) => (validation(password) ? acc + 1 : acc), 0);
    const totalValidations = this._validations.length;
    this.validationScore = Math.round((score / totalValidations) * 100);
  }

  @Input()
  set password(password: string | null | undefined) {
    this._validatePassword(password ?? '');
  }
}
