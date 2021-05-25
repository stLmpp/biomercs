import { Pipe, PipeTransform } from '@angular/core';
import { Control } from '@stlmpp/control';
import { ValidatorsModel } from '@stlmpp/control/lib/validator/validators';

@Pipe({ name: 'hasValidators' })
export class HasValidatorsPipe implements PipeTransform {
  transform(control: Control | null | undefined, validators: (keyof ValidatorsModel)[]): boolean {
    return !!control?.validators.some(validator => validators.includes(validator));
  }
}
