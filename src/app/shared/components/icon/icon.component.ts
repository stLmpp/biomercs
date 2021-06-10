import { ChangeDetectionStrategy, Component, HostBinding, Input, ViewEncapsulation } from '@angular/core';
import { AbstractComponent } from '../core/abstract-component';
import { BooleanInput, coerceBooleanProperty } from 'st-utils';

@Component({
  selector: 'icon:not([flag]):not([mdi])',
  templateUrl: './icon.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'icon' },
  encapsulation: ViewEncapsulation.None,
})
export class IconComponent extends AbstractComponent {
  private _filled = true;
  private _outlined = false;

  @Input()
  @HostBinding('class.material-icons')
  get filled(): boolean {
    return this._filled;
  }
  set filled(filled: boolean) {
    this._filled = coerceBooleanProperty(filled);
  }

  @Input()
  @HostBinding('class.material-icons-outlined')
  get outlined(): boolean {
    return this._outlined;
  }
  set outlined(outlined: boolean) {
    this._outlined = coerceBooleanProperty(outlined);
  }

  static ngAcceptInputType_outlined: BooleanInput;
  static ngAcceptInputType_filled: BooleanInput;
}
