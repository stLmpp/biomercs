import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { TitleService } from '@shared/title/title.service';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'h1[bioPageTitle],h2[bioPageTitle],h3[bioPageTitle],h4[bioPageTitle],h5[bioPageTitle],h6[bioPageTitle]',
  templateUrl: './page-title.component.html',
  styleUrls: ['./page-title.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [AsyncPipe],
})
export class PageTitleComponent {
  titleService = inject(TitleService);
}
