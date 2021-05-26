import { ChangeDetectionStrategy, Component, HostBinding, Input } from '@angular/core';
import { BooleanInput } from '@angular/cdk/coercion';
import packageJson from '../../../package.json';

@Component({
  selector: 'bio-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FooterComponent {
  @Input()
  @HostBinding('class.mobile')
  mobile: BooleanInput = false;

  version = packageJson.version;

  year = new Date().getFullYear();
  startedYear = 2021;
  poweredBy = 'stLmpp';
  github = 'https://github.com/' + this.poweredBy;
  copyright = '©' + this.startedYear + (this.year === this.startedYear ? '' : `-${this.year}`);
}
