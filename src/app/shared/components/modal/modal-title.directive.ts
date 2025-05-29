import { Directive } from '@angular/core';

@Directive({
    selector: '[bioModalTitle]',
    host: { class: 'modal-title' },
    standalone: false
})
export class ModalTitleDirective {}
