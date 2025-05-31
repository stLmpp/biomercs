import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { Score } from '@model/score';
import { BooleanInput, coerceBooleanProperty } from 'st-utils';
import { PaginationMeta } from '@model/pagination';
import { trackById } from '@util/track-by';
import { trackByFactory } from '@stlmpp/utils';
import { CardComponent } from '../../../shared/components/card/card.component';
import { LoadingComponent } from '../../../shared/components/spinner/loading/loading.component';
import { CardTitleDirective } from '../../../shared/components/card/card-title.directive';
import { CardContentDirective } from '../../../shared/components/card/card-content.directive';
import { PaginationComponent } from '../../../shared/components/pagination/pagination.component';
import { ListDirective, ListSelectable } from '../../../shared/components/list/list.directive';
import { ListItemComponent } from '../../../shared/components/list/list-item.component';
import { ListItemLineDirective } from '../../../shared/components/list/list-item-line.directive';
import { SuffixDirective } from '../../../shared/components/common/suffix.directive';
import { TooltipDirective } from '../../../shared/components/tooltip/tooltip.directive';
import { DecimalPipe } from '@angular/common';
import { ScoreFormatPipe } from '../../score-format/score-format.pipe';

@Component({
  selector: 'bio-score-list',
  templateUrl: './score-list.component.html',
  styleUrls: ['./score-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CardComponent,
    LoadingComponent,
    CardTitleDirective,
    CardContentDirective,
    PaginationComponent,
    ListDirective,
    ListSelectable,
    ListItemComponent,
    ListItemLineDirective,
    SuffixDirective,
    TooltipDirective,
    DecimalPipe,
    ScoreFormatPipe,
  ],
})
export class ScoreListComponent<T extends Score = Score> {
  readonly scores = input<T[]>([]);
  readonly loading = input<BooleanInput>(false);
  readonly paginationMeta = input<PaginationMeta | null>();
  readonly itemsPerPageOptions = input<number[]>([]);
  readonly title = input<string>();
  readonly disabledProperty = input<keyof T>();
  readonly collapsable = input(false, { transform: coerceBooleanProperty });

  readonly currentPageChange = output<number>();
  readonly itemsPerPageChange = output<number>();
  readonly scoreClicked = output<T>();

  readonly trackByScore = trackByFactory<T>('id');
  readonly trackById = trackById;

  onClick(score: T): void {
    const disabledProperty = this.disabledProperty();
    if (disabledProperty && score[disabledProperty]) {
      return;
    }
    this.scoreClicked.emit(score);
  }

  static ngAcceptInputType_collapsable: BooleanInput;
}
