import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IsSameAsLoggedPipe } from './is-same-as-logged.pipe';
import {
  ConfirmationCodeInputComponent,
  ConfirmationCodeInputDirective,
} from './confirmation-code-input/confirmation-code-input.component';
import { StControlModule } from '@stlmpp/control';
import { FormModule } from '@shared/components/form/form.module';
import { PasswordStrongComponent } from './password-strong/password-strong.component';
import { AuthDateFormatPipe } from './auth-date-format.pipe';

const DECLARATIONS = [
  ConfirmationCodeInputComponent,
  ConfirmationCodeInputDirective,
  PasswordStrongComponent,
  IsSameAsLoggedPipe,
  AuthDateFormatPipe,
];
const MODULES = [CommonModule, StControlModule, FormModule];

@NgModule({
  imports: [...MODULES, ...DECLARATIONS],
  exports: [...DECLARATIONS, ...MODULES],
})
export class AuthSharedModule {}
