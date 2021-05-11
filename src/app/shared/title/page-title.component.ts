import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TitleService } from '@shared/title/title.service';

@Component({
  selector: 'h4[bioPageTitle]',
  templateUrl: './page-title.component.html',
  styleUrls: ['./page-title.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PageTitleComponent {
  constructor(public titleService: TitleService) {}
}
