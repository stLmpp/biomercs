import { Directive } from '@angular/core';

@Directive({
  selector: '[bioCollapseTitle], bio-collapse-title',
  host: { class: 'collapse-title' },
})
export class CollapseTitleDirective {}
