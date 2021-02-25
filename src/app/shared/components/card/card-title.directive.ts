import { Directive } from '@angular/core';

@Directive({
  selector: '[cardTitle]',
  host: { class: 'card-title' },
})
export class CardTitleDirective {}
