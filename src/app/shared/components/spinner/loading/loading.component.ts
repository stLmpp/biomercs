import { ChangeDetectionStrategy, Component, Input, ViewEncapsulation } from '@angular/core';
import { BooleanInput, coerceBooleanProperty } from '@angular/cdk/coercion';
import { Animations } from '@shared/animations/animations';

@Component({
  selector: 'bio-loading',
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [Animations.fade.inOut()],
  host: {
    '[@fadeInOut]': '',
    class:
      'bio-loading bio-loading-backdrop cdk-overlay-backdrop cdk-overlay-dark-backdrop cdk-overlay-backdrop-showing',
  },
  encapsulation: ViewEncapsulation.None,
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

  static ngAcceptInputType_noBox: BooleanInput;
}
