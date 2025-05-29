import { Directive } from '@angular/core';
import { FormFieldChild } from '@shared/components/form/form-field-child';

@Directive({
    selector: '[bioPrefix]',
    host: { class: 'prefix', '[tabindex]': '-1' },
    providers: [{ provide: FormFieldChild, useExisting: PrefixDirective }],
    standalone: false
})
export class PrefixDirective {}
