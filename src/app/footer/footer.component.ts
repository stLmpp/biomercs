import { ChangeDetectionStrategy, Component, HostBinding, input } from '@angular/core';
import { BooleanInput } from 'st-utils';
import packageJson from '../../../package.json';
import { ButtonComponent } from '../shared/components/button/button.component';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'bio-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ButtonComponent, RouterLink],
})
export class FooterComponent {
  @HostBinding('class.mobile')
  readonly mobile = input<BooleanInput>(false);

  readonly version = packageJson.version;

  readonly year = new Date().getFullYear();
  readonly startedYear = 2021;
  readonly copyright = '\u00A9' + this.startedYear + (this.year === this.startedYear ? '' : `-${this.year}`);
}
