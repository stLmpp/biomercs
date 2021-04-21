import { Directive } from '@angular/core';

@Directive({
  selector: '[bioCardSubtitle]',
  host: { class: 'card-subtitle' },
})
export class CardSubtitleDirective {}
