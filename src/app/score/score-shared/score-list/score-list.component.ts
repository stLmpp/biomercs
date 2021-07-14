import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { Score } from '@model/score';
import { BooleanInput, coerceBooleanProperty } from '@angular/cdk/coercion';
import { PaginationMeta } from '@model/pagination';
import { trackById } from '@util/track-by';
import { trackByFactory } from '@stlmpp/utils';

@Component({
  selector: 'bio-score-list',
  templateUrl: './score-list.component.html',
  styleUrls: ['./score-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ScoreListComponent<T extends Score = Score> {
  private _collapsable = false;

  @Input() scores: T[] = [];
  @Input() loading: BooleanInput = false;
  @Input() paginationMeta?: PaginationMeta | null;
  @Input() itemsPerPageOptions: number[] = [];
  @Input() title?: string;
  @Input() disabledProperty?: keyof T;

  @Input()
  get collapsable(): boolean {
    return this._collapsable;
  }
  set collapsable(collapsable: boolean) {
    this._collapsable = coerceBooleanProperty(collapsable);
  }

  @Output() readonly currentPageChange = new EventEmitter<number>();
  @Output() readonly itemsPerPageChange = new EventEmitter<number>();
  @Output() readonly scoreClicked = new EventEmitter<T>();

  readonly trackByScore = trackByFactory<T>('id');
  readonly trackById = trackById;

  onClick(score: T): void {
    if (this.disabledProperty && score[this.disabledProperty]) {
      return;
    }
    this.scoreClicked.emit(score);
  }

  static ngAcceptInputType_collapsable: BooleanInput;
}
