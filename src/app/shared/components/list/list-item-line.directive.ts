import { Directive } from '@angular/core';

@Directive({ selector: 'bio-list-item-line,[bio-list-item-line],[bioListItemLine]', host: { class: 'list-item-line' } })
export class ListItemLineDirective {}
