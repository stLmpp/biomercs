import { Directive, HostBinding, Input } from '@angular/core';

@Directive({
    selector: 'textarea[bioInput]',
    standalone: false
})
export class TextareaDirective {
  @Input() @HostBinding('style.resize') resize: 'vertical' | 'horizontal' | undefined;
}
