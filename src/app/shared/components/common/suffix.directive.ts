import { Directive } from '@angular/core';

@Directive({
  selector: '[suffix]',
  host: { class: 'suffix', '[tabindex]': '-1' },
})
export class SuffixDirective {}
