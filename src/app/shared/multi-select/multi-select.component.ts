import { ChangeDetectionStrategy, Component, Input, output } from '@angular/core';
import { BooleanInput, coerceBooleanProperty } from 'st-utils';
import { ButtonComponent } from '../components/button/button.component';
import { IconComponent } from '../components/icon/icon.component';

@Component({
  selector: 'bio-multi-select',
  templateUrl: './multi-select.component.html',
  styleUrls: ['./multi-select.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ButtonComponent, IconComponent],
})
export class MultiSelectComponent {
  private _disabledSelectAll = false;
  private _disabledRemoveAll = false;

  @Input()
  get disabledSelectAll(): boolean {
    return this._disabledSelectAll;
  }
  set disabledSelectAll(disabledSelectAll: boolean) {
    this._disabledSelectAll = coerceBooleanProperty(disabledSelectAll);
  }

  @Input()
  get disabledRemoveAll(): boolean {
    return this._disabledRemoveAll;
  }
  set disabledRemoveAll(disabledRemoveAll: boolean) {
    this._disabledRemoveAll = coerceBooleanProperty(disabledRemoveAll);
  }

  readonly allSelected = output<void>();
  readonly allRemoved = output<void>();

  static ngAcceptInputType_disabledSelectAll: BooleanInput;
  static ngAcceptInputType_disabledRemoveAll: BooleanInput;
}
