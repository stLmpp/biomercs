import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { BooleanInput, coerceBooleanProperty } from '@angular/cdk/coercion';

@Component({
  selector: 'loading',
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoadingComponent {
  private _noBox = false;

  @Input()
  get noBox(): boolean {
    return this._noBox;
  }
  set noBox(noBox: boolean) {
    this._noBox = coerceBooleanProperty(noBox);
  }

  @Input() show: boolean | null = false;

  static ngAcceptInputType_noBox: BooleanInput;
}
