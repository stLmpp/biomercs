import { Directive } from '@angular/core';

@Directive({
  selector: '[cardContent], card-content',
  host: { class: 'card-content' },
})
export class CardContentDirective {}
