import { ChangeDetectionStrategy, Component, ViewEncapsulation, input } from '@angular/core';
import { AbstractComponent } from '@shared/components/core/abstract-component';

@Component({
  selector: 'bio-icon[mdi]:not([flag])',
  templateUrl: './icon-mdi.component.html',
  styleUrls: ['./icon.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: { class: 'icon icon-mdi' },
})
export class IconMdiComponent extends AbstractComponent {
  readonly mdi = input('M13,14H11V10H13M13,18H11V16H13M1,21H23L12,2L1,21Z');
  readonly size = input<number | null>();
}
