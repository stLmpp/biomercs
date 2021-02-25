import { Directive } from '@angular/core';

@Directive({
  selector: '[modalContent],modal-content',
  host: { class: 'modal-content' },
})
export class ModalContentDirective {}
