import { Directive } from '@angular/core';
import { CardActionsDirective } from '../card/card-actions.directive';

@Directive({
  selector: '[bioModalActions],bio-modal-actions',
  host: { class: 'modal-actions' },
})
export class ModalActionsDirective extends CardActionsDirective {}
