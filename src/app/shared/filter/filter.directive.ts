import { AfterContentInit, ContentChildren, Directive, EventEmitter, Input, Output, QueryList } from '@angular/core';
import { FilterItemDirective } from '@shared/filter/filter-item.directive';
import { LocalState } from '@stlmpp/store';
import { combineLatest, map, Observable, startWith, takeUntil } from 'rxjs';
import { normalizeString } from 'st-utils';

interface FilterDirectiveState {
  bioFilter: string | null | undefined;
}

@Directive({ selector: '[bioFilter]' })
export class FilterDirective extends LocalState<FilterDirectiveState> implements AfterContentInit {
  constructor() {
    super({ bioFilter: null }, { inputs: ['bioFilter'] });
  }

  @ContentChildren(FilterItemDirective, { descendants: true }) filterItemDirectives!: QueryList<FilterItemDirective>;

  @Input() bioFilter: string | null | undefined = null;

  @Output() readonly bioFilterChange = new EventEmitter<FilterItemDirective[]>();

  ngAfterContentInit(): void {
    const items$: Observable<QueryList<FilterItemDirective>> = this.filterItemDirectives.changes.pipe(
      startWith(this.filterItemDirectives)
    );
    const filterBy$ = this.selectState('bioFilter').pipe(
      map(filterBy => filterBy && normalizeString(filterBy).toLowerCase())
    );

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
