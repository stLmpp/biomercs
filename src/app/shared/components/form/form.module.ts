import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InputDirective } from './input.directive';
import { LabelDirective } from './label.directive';
import { SpinnerModule } from '../spinner/spinner.module';
import { FormFieldErrorsDirective } from './errors.directive';
import { FormFieldComponent } from './form-field.component';
import { FormFieldErrorComponent } from './error.component';
import { FormFieldHintDirective } from './hint.directive';
import { NgLetModule } from '../../let/ng-let.module';
import { TextareaDirective } from './textarea.directive';
import { BioCommonModule } from '../common/bio-common.module';
import { SelectModule } from '../select/select.module';
import { ArrayModule } from '@shared/array/array.module';
import { ValidationModule } from '@shared/validators/validation.module';

@NgModule({
  declarations: [
    InputDirective,
    FormFieldComponent,
    LabelDirective,
    FormFieldErrorsDirective,
    FormFieldErrorComponent,
    FormFieldHintDirective,
    TextareaDirective,
  ],
  exports: [
    InputDirective,
    FormFieldComponent,
    LabelDirective,
    FormFieldErrorsDirective,
    FormFieldErrorComponent,
    FormFieldHintDirective,
    TextareaDirective,
    BioCommonModule,
  ],
  imports: [CommonModule, SpinnerModule, NgLetModule, BioCommonModule, SelectModule, ArrayModule, ValidationModule],
})
export class FormModule {}
