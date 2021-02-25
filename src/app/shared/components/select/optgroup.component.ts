import { ChangeDetectionStrategy, Component, Input, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'bio-optgroup',
  templateUrl: './optgroup.component.html',
  styleUrls: ['./optgroup.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: { class: 'bio-optgroup' },
})
export class OptgroupComponent {
  @Input() label!: string;
}
