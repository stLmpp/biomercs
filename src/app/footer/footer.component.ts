import { ChangeDetectionStrategy, Component, HostBinding, Input } from '@angular/core';
import { BooleanInput } from 'st-utils';
import packageJson from '../../../package.json';

@Component({
    selector: 'bio-footer',
    templateUrl: './footer.component.html',
    styleUrls: ['./footer.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false
})
export class FooterComponent {
  @Input()
  @HostBinding('class.mobile')
  mobile: BooleanInput = false;

  readonly version = packageJson.version;

  readonly year = new Date().getFullYear();
  readonly startedYear = 2021;
  readonly copyright = '\u00A9' + this.startedYear + (this.year === this.startedYear ? '' : `-${this.year}`);
}
