import { Directive } from '@angular/core';

@Directive({
  selector: '[bioModalContent],bio-modal-content',
  host: { class: 'modal-content' },
})
export class ModalContentDirective {}
