import { Directive, ElementRef, Injectable, Input, OnChanges, Renderer2, SimpleChanges, DOCUMENT, inject } from '@angular/core';
import { ControlValue } from '@stlmpp/control';
import { IConfig, initialConfig, MaskDirective as _MaskDirective, MaskService as _MaskService } from 'ngx-mask';
import { Subject } from 'rxjs';

import { MASK_CONFIG } from '@shared/mask/mask-config.token';

@Injectable()
export class MaskService extends _MaskService {
  constructor() {
    const document = inject<Document>(DOCUMENT);
    const elementRef = inject(ElementRef);
    const renderer = inject(Renderer2);
    const config = inject<Partial<IConfig>>(MASK_CONFIG, { optional: true });

    super(document, { ...initialConfig, ...config }, elementRef, renderer);
  }
}

@Directive({
  selector: 'input[bioMask]',
  providers: [{ provide: ControlValue, useExisting: MaskDirective, multi: false }, MaskService],
})
export class MaskDirective extends _MaskDirective implements ControlValue<string>, OnChanges {
  constructor() {
    const document = inject<Document>(DOCUMENT);
    const maskService = inject(MaskService);
    const maskConfig = inject<Partial<IConfig>>(MASK_CONFIG, { optional: true });

    super(document, maskService, { ...initialConfig, ...maskConfig });
    this.registerOnChange((value: string) => {
      this.onChange$.next(value);
    });
    this.registerOnTouched(() => this.onTouched$.next());
  }

  @Input()
  set bioMask(mask: string) {
    this.maskExpression = mask;
  }

  readonly onChange$ = new Subject<string>();
  readonly onTouched$ = new Subject<void>();

  setDisabled(disabled: boolean): void {
    super.setDisabledState(disabled);
  }

  async setValue(value: string): Promise<void> {
    return super.writeValue(value);
  }

  override ngOnChanges(changes: SimpleChanges): void {
    if (changes.bioMask) {
      changes.maskExpression = changes.bioMask;
    }
    super.ngOnChanges(changes);
  }
}
