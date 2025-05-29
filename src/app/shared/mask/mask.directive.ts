import {
  Directive,
  ElementRef,
  Inject,
  Injectable,
  Input,
  OnChanges,
  Optional,
  Renderer2,
  SimpleChanges,
  DOCUMENT
} from '@angular/core';
import { ControlValue } from '@stlmpp/control';
import { IConfig, initialConfig, MaskDirective as _MaskDirective, MaskService as _MaskService } from 'ngx-mask';
import { Subject } from 'rxjs';

import { MASK_CONFIG } from '@shared/mask/mask-config.token';

@Injectable()
export class MaskService extends _MaskService {
  constructor(
    @Inject(DOCUMENT) document: Document,
    elementRef: ElementRef,
    renderer: Renderer2,
    @Optional() @Inject(MASK_CONFIG) config?: Partial<IConfig>
  ) {
    super(document, { ...initialConfig, ...config }, elementRef, renderer);
  }
}

@Directive({
    selector: 'input[bioMask]',
    providers: [{ provide: ControlValue, useExisting: MaskDirective, multi: false }, MaskService],
    standalone: false
})
export class MaskDirective extends _MaskDirective implements ControlValue<string>, OnChanges {
  constructor(
    @Inject(DOCUMENT) document: Document,
    maskService: MaskService,
    @Optional() @Inject(MASK_CONFIG) maskConfig?: Partial<IConfig>
  ) {
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
