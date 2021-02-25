import { Directive } from '@angular/core';

@Directive({
  selector: '[cardSubtitle]',
  host: { class: 'card-subtitle' },
})
export class CardSubtitleDirective {}
