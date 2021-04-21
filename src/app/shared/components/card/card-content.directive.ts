import { Directive } from '@angular/core';

@Directive({
  selector: '[bioCardContent], bio-card-content',
  host: { class: 'card-content' },
})
export class CardContentDirective {}
