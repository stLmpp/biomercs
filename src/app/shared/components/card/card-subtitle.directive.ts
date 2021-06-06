import { Directive } from '@angular/core';
import { CardChild } from '@shared/components/card/card-child';

@Directive({
  selector: '[bioCardSubtitle]',
  host: { class: 'card-subtitle' },
  providers: [{ provide: CardChild, useExisting: CardSubtitleDirective, multi: true }],
})
export class CardSubtitleDirective {}
