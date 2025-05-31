import { Directive, HostBinding, input } from '@angular/core';

@Directive({ selector: 'textarea[bioInput]' })
export class TextareaDirective {
  @HostBinding('style.resize')
  readonly resize = input<'vertical' | 'horizontal'>();
}
