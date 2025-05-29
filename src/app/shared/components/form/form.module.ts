import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InputDirective } from './input.directive';
import { LabelDirective } from './label.directive';
import { FormFieldErrorsDirective } from './errors.directive';
import { FormFieldComponent } from './form-field.component';
import { FormFieldErrorComponent } from './error.component';
import { FormFieldHintDirective } from './hint.directive';
import { TextareaDirective } from './textarea.directive';
import { ValidationModule } from '@shared/validators/validation.module';
import { SpinnerModule } from '@shared/components/spinner/spinner.module';
import { BioCommonModule } from '@shared/components/common/bio-common.module';

const DECLARATIONS = [
  InputDirective,
  FormFieldComponent,
  LabelDirective,
  FormFieldErrorsDirective,
  FormFieldErrorComponent,
  FormFieldHintDirective,
  TextareaDirective,
];

const MODULES = [CommonModule, ValidationModule, SpinnerModule, BioCommonModule];

@NgModule({
  imports: [...MODULES, ...DECLARATIONS],
  exports: [...DECLARATIONS, ...MODULES],
})
export class FormModule {}
