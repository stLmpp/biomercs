import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { BreadcrumbsService } from '@shared/breadcrumbs/breadcrumbs.service';

@Component({
  selector: 'bio-breadcrumbs',
  templateUrl: './breadcrumbs.component.html',
  styleUrls: ['./breadcrumbs.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BreadcrumbsComponent {
  constructor(private breadcrumbsService: BreadcrumbsService) {}

  readonly breadcrumbs$ = this.breadcrumbsService.breadcrumbs$;
}
