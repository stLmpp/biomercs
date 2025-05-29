import { Directive } from '@angular/core';

@Directive({
  selector: 'bio-list-item[bioMultiSelectItem],[bioListItem][bioMultiSelectItem]',
  host: { class: 'multi-select-item' },
})
export class MultiSelectItemDirective {}
