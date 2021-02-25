import { Directive } from '@angular/core';

@Directive({
  selector: '[collapseTitle], collapse-title',
  host: { class: 'collapse-title' },
})
export class CollapseTitleDirective {}
