import { NgModule } from '@angular/core';
import { PersonaNameExistsValidatorDirective } from '@shared/validators/persona-name-exists.validator';

const DECLARATIONS = [PersonaNameExistsValidatorDirective];

@NgModule({
  declarations: [...DECLARATIONS],
  exports: [...DECLARATIONS],
})
export class ValidationModule {}
