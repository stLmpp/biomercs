import { ChangeDetectionStrategy, Component, Input, Output, EventEmitter } from '@angular/core';
import { ScoreVW, trackByScoreVW } from '@model/score';
import { trackByScorePlayerVW } from '@model/score-player';
import { BooleanInput } from '@angular/cdk/coercion';
import { PaginationMetaVW } from '@model/pagination';
import { trackByFactory } from '@stlmpp/utils';

@Component({
  selector: 'bio-score-list',
  templateUrl: './score-list.component.html',
  styleUrls: ['./score-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ScoreListComponent<T extends ScoreVW = ScoreVW> {
  constructor() {}

  @Input() scores: T[] = [];
  @Input() loading: BooleanInput = false;
  @Input() paginationMeta?: PaginationMetaVW | null;
  @Input() itemsPerPageOptions: number[] = [];

  @Output() readonly currentPageChange = new EventEmitter<number>();
  @Output() readonly itemsPerPageChange = new EventEmitter<number>();
  @Output() readonly scoreClicked = new EventEmitter<T>();

  trackByScore = trackByFactory<T>('idScore');
  trackByScorePlayerVW = trackByScorePlayerVW;
}
