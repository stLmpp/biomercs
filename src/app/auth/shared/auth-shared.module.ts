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

const PIPES = [IsSameAsLoggedPipe, AuthDateFormatPipe];
const DECLARATIONS = [ConfirmationCodeInputComponent, ConfirmationCodeInputDirective, PasswordStrongComponent];

@NgModule({
  declarations: [...PIPES, ...DECLARATIONS],
  imports: [CommonModule, StControlModule, FormModule],
  exports: [...PIPES, ...DECLARATIONS],
})
export class AuthSharedModule {}
