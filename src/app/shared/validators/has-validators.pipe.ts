import { Pipe, PipeTransform } from '@angular/core';
import { Control, ValidatorsKeys } from '@stlmpp/control';

@Pipe({ name: 'hasValidators' })
export class HasValidatorsPipe implements PipeTransform {
  transform(control: Control | null | undefined, validators: ValidatorsKeys[]): boolean {
    return !!control?.hasValidators(validators);
  }
}
