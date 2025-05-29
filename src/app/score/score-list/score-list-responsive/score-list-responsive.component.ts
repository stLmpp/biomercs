import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import {
  BreakpointObserverService,
  MediaQueryEnum,
} from '@shared/services/breakpoint-observer/breakpoint-observer.service';
import { Score } from '@model/score';
import { map } from 'rxjs';
import { BooleanInput, coerceBooleanProperty } from 'st-utils';
import { PaginationMeta } from '@model/pagination';
import { TableCellNotifyChange, TableOrder } from '@shared/components/table/type';
import { ColDef } from '@shared/components/table/col-def';
import { PaginationComponent } from '@shared/components/pagination/pagination.component';

@Component({
    selector: 'bio-score-list-responsive',
    templateUrl: './score-list-responsive.component.html',
    styleUrls: ['./score-list-responsive.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false
})
export class ScoreListResponsiveComponent<T extends Score = Score> {
  constructor(private breakpointObserverService: BreakpointObserverService) {}

  private _collapsable = false;

  @Input() scores: T[] = [];

  @Input() loading: BooleanInput = false;
  @Input() paginationMeta?: PaginationMeta | null;
  @Input() itemsPerPageOptions: number[] = PaginationComponent.defaultItemsPerPageOptions;
  @Input() order?: TableOrder<T> | null;
  @Input() colDefs!: ColDef<T>[];
  @Input() colDefDefault: Partial<ColDef<T>> = {};
  @Input() metadata: any;
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
  @Output() readonly orderChange = new EventEmitter<TableOrder<T>>();
  @Output() readonly notifyChange = new EventEmitter<TableCellNotifyChange<any, T>>();
  @Output() readonly scoreClicked = new EventEmitter<T>();

  readonly isSmall$ = this.breakpointObserverService.observe([MediaQueryEnum.md]).pipe(map(isMd => !isMd));

  static ngAcceptInputType_collapsable: BooleanInput;
}
