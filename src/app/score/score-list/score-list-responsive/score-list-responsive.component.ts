import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, inject, input } from '@angular/core';
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
import { ScoreListComponent } from '../score-list/score-list.component';
import { TableComponent } from '../../../shared/components/table/table.component';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'bio-score-list-responsive',
  templateUrl: './score-list-responsive.component.html',
  styleUrls: ['./score-list-responsive.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ScoreListComponent, TableComponent, AsyncPipe],
})
export class ScoreListResponsiveComponent<T extends Score = Score> {
  private breakpointObserverService = inject(BreakpointObserverService);


  private _collapsable = false;

  readonly scores = input<T[]>([]);

  readonly loading = input<BooleanInput>(false);
  readonly paginationMeta = input<PaginationMeta | null>();
  readonly itemsPerPageOptions = input<number[]>(PaginationComponent.defaultItemsPerPageOptions);
  readonly order = input<TableOrder<T> | null>();
  readonly colDefs = input.required<ColDef<T>[]>();
  readonly colDefDefault = input<Partial<ColDef<T>>>({});
  readonly metadata = input<any>();
  readonly title = input<string>();
  readonly disabledProperty = input<keyof T>();

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
