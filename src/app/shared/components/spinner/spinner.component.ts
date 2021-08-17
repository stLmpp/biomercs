import { ChangeDetectionStrategy, Component, Input, OnChanges, ViewEncapsulation } from '@angular/core';
import { BooleanInput, coerceBooleanProperty, coerceNumberProperty, NumberInput } from 'st-utils';
import { Animations } from '../../animations/animations';
import { SimpleChangesCustom } from '@util/util';

@Component({
  selector: 'bio-spinner',
  templateUrl: './spinner.component.html',
  styleUrls: ['./spinner.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: { class: 'spinner', '[@fadeInOut]': '' },
  animations: [Animations.fade.inOut()],
})
export class SpinnerComponent implements OnChanges {
  @Input()
  set size(size: number) {
    size = coerceNumberProperty(size);
    if (size > 1 || !size) {
      size = 1;
    }
    this._size = size;
  }
  get size(): number {
    return this._size;
  }
  private _size = 1;

  @Input() baseSize = 200;
  @Input() small: BooleanInput;
  @Input() medium: BooleanInput;
  @Input() large: BooleanInput;

  ngOnChanges(changes: SimpleChangesCustom<SpinnerComponent>): void {
    if (changes.small && coerceBooleanProperty(changes.small.currentValue)) {
      this.size = 0.15;
    }
    if (changes.medium && coerceBooleanProperty(changes.medium.currentValue)) {
      this.size = 0.3;
    }
    if (changes.large && coerceBooleanProperty(changes.large.currentValue)) {
      this.size = 0.6;
    }
  }

  static ngAcceptInputType_small: BooleanInput;
  static ngAcceptInputType_medium: BooleanInput;
  static ngAcceptInputType_large: BooleanInput;
  static ngAcceptInputType_size: NumberInput;
}
