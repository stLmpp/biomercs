import { Directive } from '@angular/core';
import { CardChild } from '@shared/components/card/card-child';

@Directive({
  selector: '[bioCardTitle]',
  host: { class: 'card-title' },
  providers: [{ provide: CardChild, useExisting: CardTitleDirective, multi: true }],
})
export class CardTitleDirective {}
