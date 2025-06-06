import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { BooleanInput, coerceBooleanProperty } from 'st-utils';

@Component({
  selector: 'bio-multi-select',
  templateUrl: './multi-select.component.html',
  styleUrls: ['./multi-select.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
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

  @Output() readonly allSelected = new EventEmitter<void>();
  @Output() readonly allRemoved = new EventEmitter<void>();

  static ngAcceptInputType_disabledSelectAll: BooleanInput;
  static ngAcceptInputType_disabledRemoveAll: BooleanInput;
}
