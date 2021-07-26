import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { map, Observable, pluck, shareReplay } from 'rxjs';
import { RouteDataEnum } from '@model/enum/route-data.enum';
import { trackByFactory } from '@stlmpp/utils';
import { PossiblePath } from './not-found.resolver';

@Component({
  selector: 'bio-not-found',
  templateUrl: './not-found.component.html',
  styleUrls: ['./not-found.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotFoundComponent {
  constructor(private activatedRoute: ActivatedRoute) {}

  readonly possiblePaths$: Observable<PossiblePath[]> = this.activatedRoute.data.pipe(
    pluck(RouteDataEnum.possiblePaths),
    map(possiblePaths => possiblePaths ?? []),
    shareReplay()
  );

  trackBy = trackByFactory<PossiblePath>('path');
}
