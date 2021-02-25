import { Directive } from '@angular/core';

@Directive({
  selector: '[prefix]',
  host: { class: 'prefix', '[tabindex]': '-1' },
})
export class PrefixDirective {}
