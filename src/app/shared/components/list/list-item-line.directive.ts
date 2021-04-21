import { Directive } from '@angular/core';

@Directive({ selector: 'bio-list-item-line,[list-item-line],[listItemLine]', host: { class: 'list-item-line' } })
export class ListItemLineDirective {}
