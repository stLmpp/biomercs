import { AfterContentInit, ContentChildren, Directive, EventEmitter, Input, Output, QueryList } from '@angular/core';
import { FilterItemDirective } from '@shared/filter/filter-item.directive';
import { combineLatest, map, Observable, ReplaySubject, startWith, takeUntil } from 'rxjs';
import { normalizeString } from 'st-utils';
import { Destroyable } from '@shared/components/common/destroyable-component';

@Directive({ selector: '[bioFilter]' })
export class FilterDirective extends Destroyable implements AfterContentInit {
  private readonly _bioFilter$ = new ReplaySubject<string | null | undefined>();

  @ContentChildren(FilterItemDirective, { descendants: true })
  readonly filterItemDirectives!: QueryList<FilterItemDirective>;

  @Input()
  set bioFilter(bioFilter: string | null | undefined) {
    this._bioFilter$.next(bioFilter);
  }

  @Output() readonly bioFilterChange = new EventEmitter<FilterItemDirective[]>();

  ngAfterContentInit(): void {
    const items$: Observable<QueryList<FilterItemDirective>> = this.filterItemDirectives.changes.pipe(
      startWith(this.filterItemDirectives)
    );
    const filterBy$ = this._bioFilter$.pipe(map(filterBy => filterBy && normalizeString(filterBy).toLowerCase()));
    combineLatest([items$, filterBy$])
      .pipe(takeUntil(this.destroy$))
      .subscribe(([items, filterBy]) => {
        const itemsToEmit: FilterItemDirective[] = [];
        for (const item of items) {
          const text = item.getFilterText();
          item.setHidden(!!filterBy && !normalizeString(text).toLowerCase().includes(filterBy));
          if (!item.hidden) {
            itemsToEmit.push(item);
          }
        }
        this.bioFilterChange.emit(itemsToEmit);
      });
  }
}
