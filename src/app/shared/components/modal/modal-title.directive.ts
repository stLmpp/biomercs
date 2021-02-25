import { Directive } from '@angular/core';

@Directive({
  selector: '[modalTitle]',
  host: { class: 'modal-title' },
})
export class ModalTitleDirective {}
