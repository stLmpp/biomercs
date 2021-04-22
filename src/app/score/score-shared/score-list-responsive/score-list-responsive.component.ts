import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import {
  BreakpointObserverService,
  MediaQueryEnum,
} from '@shared/services/breakpoint-observer/breakpoint-observer.service';
import { ScoreVW, trackByScoreVW } from '@model/score';
import { map } from 'rxjs/operators';
import { BooleanInput } from 'st-utils';
import { PaginationMetaVW } from '@model/pagination';
import { TableCellNotifyChange, TableOrder } from '@shared/components/table/type';
import { ColDef } from '@shared/components/table/col-def';

@Component({
  selector: 'bio-score-list-responsive',
  templateUrl: './score-list-responsive.component.html',
  styleUrls: ['./score-list-responsive.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ScoreListResponsiveComponent {
  constructor(private breakpointObserverService: BreakpointObserverService) {}

  @Input() scores: ScoreVW[] = [];

  @Input() loading: BooleanInput = false;
  @Input() paginationMeta?: PaginationMetaVW | null;
  @Input() itemsPerPageOptions: number[] = [];
  @Input() order?: TableOrder<ScoreVW> | null;
  @Input() colDefs!: ColDef<ScoreVW>[];
  @Input() colDefDefault: Partial<ColDef<ScoreVW>> = {};
  @Input() metadata: any;

  @Output() readonly currentPageChange = new EventEmitter<number>();
  @Output() readonly itemsPerPageChange = new EventEmitter<number>();
  @Output() readonly orderChange = new EventEmitter<TableOrder<ScoreVW>>();
  @Output() readonly notifyChange = new EventEmitter<TableCellNotifyChange<any, ScoreVW>>();

  isSmall$ = this.breakpointObserverService.observe([MediaQueryEnum.md]).pipe(map(isMd => !isMd));

  trackByScore = trackByScoreVW;
}
