import { Directive } from '@angular/core';
import { FormFieldChild } from '@shared/components/form/form-field-child';

@Directive({
    selector: '[bioSuffix]',
    host: { class: 'suffix', '[tabindex]': '-1' },
    providers: [{ provide: FormFieldChild, useExisting: SuffixDirective }],
    standalone: false
})
export class SuffixDirective {}
