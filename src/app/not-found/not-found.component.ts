import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { map, Observable, pluck, shareReplay } from 'rxjs';
import { RouteDataEnum } from '@model/enum/route-data.enum';
import { trackByFactory } from '@stlmpp/utils';
import { PossiblePath } from './not-found.resolver';
import { CardComponent } from '../shared/components/card/card.component';
import { CardTitleDirective } from '../shared/components/card/card-title.directive';
import { CardSubtitleDirective } from '../shared/components/card/card-subtitle.directive';
import { CardContentDirective } from '../shared/components/card/card-content.directive';
import { ButtonComponent } from '../shared/components/button/button.component';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'bio-not-found',
  templateUrl: './not-found.component.html',
  styleUrls: ['./not-found.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CardComponent,
    CardTitleDirective,
    CardSubtitleDirective,
    CardContentDirective,
    ButtonComponent,
    RouterLink,
    AsyncPipe,
  ],
})
export class NotFoundComponent {
  private activatedRoute = inject(ActivatedRoute);


  readonly possiblePaths$: Observable<PossiblePath[]> = this.activatedRoute.data.pipe(
    pluck(RouteDataEnum.possiblePaths),
    map(possiblePaths => possiblePaths ?? []),
    shareReplay()
  );

  trackBy = trackByFactory<PossiblePath>('path');
}
