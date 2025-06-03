import { ChangeDetectionStrategy, Component } from '@angular/core';
import { BreadcrumbsService } from '@shared/breadcrumbs/breadcrumbs.service';
import { Observable } from 'rxjs';
import { BreadcrumbsItem } from '@shared/breadcrumbs/breadcrumbs';
import { trackByFactory } from '@stlmpp/utils';

@Component({
  selector: 'bio-breadcrumbs',
  templateUrl: './breadcrumbs.component.html',
  styleUrls: ['./breadcrumbs.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'breadcrumbs' },
})
export class BreadcrumbsComponent {
  constructor(private breadcrumbsService: BreadcrumbsService) {}

  readonly breadcrumbs$: Observable<BreadcrumbsItem[]> = this.breadcrumbsService.breadcrumbs$;

  trackBy = trackByFactory<BreadcrumbsItem>();
}
