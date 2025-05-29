import { Directive } from '@angular/core';
import { CardChild } from '@shared/components/card/card-child';

@Directive({
    selector: '[bioCardContent], bio-card-content',
    host: { class: 'card-content' },
    providers: [{ provide: CardChild, useExisting: CardContentDirective, multi: true }],
    standalone: false
})
export class CardContentDirective {}
