import { Directive } from '@angular/core';
import { FormFieldChild } from '@shared/components/form/form-field-child';

@Directive({
  selector: '[suffix]',
  host: { class: 'suffix', '[tabindex]': '-1' },
  providers: [{ provide: FormFieldChild, useExisting: SuffixDirective }],
})
export class SuffixDirective {}
