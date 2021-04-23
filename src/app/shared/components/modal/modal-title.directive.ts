import { Directive } from '@angular/core';

@Directive({
  selector: '[bioModalTitle]',
  host: { class: 'modal-title' },
})
export class ModalTitleDirective {}
