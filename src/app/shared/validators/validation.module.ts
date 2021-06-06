import { NgModule } from '@angular/core';
import { PersonaNameExistsValidatorDirective } from '@shared/validators/persona-name-exists.validator';
import { HasValidatorsPipe } from '@shared/validators/has-validators.pipe';

const DECLARATIONS = [PersonaNameExistsValidatorDirective, HasValidatorsPipe];

@NgModule({
  declarations: [...DECLARATIONS],
  exports: [...DECLARATIONS],
})
export class ValidationModule {}
