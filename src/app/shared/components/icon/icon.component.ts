import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { AbstractComponent } from '../core/abstract-component';

@Component({
  selector: 'icon:not([flag])',
  templateUrl: './icon.component.html',
  styleUrls: ['./icon.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'material-icons icon' },
  encapsulation: ViewEncapsulation.None,
})
export class IconComponent extends AbstractComponent {}
