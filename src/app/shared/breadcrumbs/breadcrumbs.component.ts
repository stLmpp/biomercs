import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { BreadcrumbsService } from '@shared/breadcrumbs/breadcrumbs.service';
import { Observable } from 'rxjs';
import { BreadcrumbsItem } from '@shared/breadcrumbs/breadcrumbs';
import { trackByIndex } from '@util/track-by';
import { RouterLink } from '@angular/router';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'bio-breadcrumbs',
  templateUrl: './breadcrumbs.component.html',
  styleUrls: ['./breadcrumbs.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'breadcrumbs' },
  imports: [RouterLink, AsyncPipe],
})
export class BreadcrumbsComponent {
  private breadcrumbsService = inject(BreadcrumbsService);

  readonly breadcrumbs$: Observable<BreadcrumbsItem[]> = this.breadcrumbsService.breadcrumbs$;

  trackBy = trackByIndex;
}
