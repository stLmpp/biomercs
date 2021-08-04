import { ChangeDetectionStrategy, Component, Input, ViewEncapsulation } from '@angular/core';
import { AbstractComponent } from '@shared/components/core/abstract-component';

@Component({
  selector: 'icon[mdi]:not([flag])',
  templateUrl: './icon-mdi.component.html',
  styleUrls: ['./icon.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: { class: 'icon icon-mdi' },
})
export class IconMdiComponent extends AbstractComponent {
  @Input() mdi = 'M13,14H11V10H13M13,18H11V16H13M1,21H23L12,2L1,21Z';
  @Input() size?: number | null;
}
