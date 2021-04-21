import { Directive } from '@angular/core';

@Directive({
  selector: '[bioCardTitle]',
  host: { class: 'card-title' },
})
export class CardTitleDirective {}
