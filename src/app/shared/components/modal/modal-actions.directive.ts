import { Directive } from '@angular/core';
import { CardActionsDirective } from '../card/card-actions.directive';

@Directive({
  selector: '[modalActions],modal-actions',
  host: { class: 'modal-actions' },
})
export class ModalActionsDirective extends CardActionsDirective {}
