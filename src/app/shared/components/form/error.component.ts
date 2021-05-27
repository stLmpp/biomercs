import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { Animations } from '../../animations/animations';

@Component({
  selector: 'error',
  template: '<ng-content></ng-content>',
  host: { class: 'form-field-error', '[@slideIn]': '' },
  encapsulation: ViewEncapsulation.None,
  animations: [Animations.slide.in()],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormFieldErrorComponent {}
