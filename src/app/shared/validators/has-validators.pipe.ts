import { Pipe, PipeTransform } from '@angular/core';
import { Control, ValidatorsModel } from '@stlmpp/control';

@Pipe({ name: 'hasValidators' })
export class HasValidatorsPipe implements PipeTransform {
  transform(control: Control | null | undefined, validators: (keyof ValidatorsModel)[]): boolean {
    return !!control?.hasValidators(validators);
  }
}
