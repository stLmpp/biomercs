import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { Animations } from '../../animations/animations';
import { FormFieldChild } from '@shared/components/form/form-field-child';

@Component({
  selector: 'bio-error',
  template: '<ng-content />',
  host: { class: 'form-field-error', '[@slideIn]': '' },
  encapsulation: ViewEncapsulation.None,
  animations: [Animations.slide.in()],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [{ provide: FormFieldChild, useExisting: FormFieldErrorComponent }],
})
export class FormFieldErrorComponent {}
