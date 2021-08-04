import { ChangeDetectionStrategy, Component, HostBinding, Input, ViewEncapsulation } from '@angular/core';
import { AbstractComponent } from '@shared/components/core/abstract-component';

@Component({
  selector: 'icon[flag]',
  templateUrl: './flag.component.html',
  styleUrls: ['./flag.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class FlagComponent extends AbstractComponent {
  private _flag = '';

  @Input()
  set flag(flag: string | null | undefined) {
    this._flag = (flag ?? '').toLowerCase();
  }

  @HostBinding('class')
  get class(): string {
    return `icon flag-icon flag-icon-${this._flag.toLowerCase()}`;
  }

  @HostBinding('style.background-image')
  get backgroundImage(): string {
    return `url(/assets/flag/${this._flag.toLowerCase()}.svg)`;
  }
}
