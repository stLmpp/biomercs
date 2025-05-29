import { AfterViewInit, ChangeDetectionStrategy, Component, ViewChild } from '@angular/core';
import { BreakpointObserverService } from '@shared/services/breakpoint-observer/breakpoint-observer.service';
import { AccordionDirective } from '@shared/components/accordion/accordion.directive';
import { Destroyable } from '@shared/components/common/destroyable-component';
import { ActivatedRoute, Router } from '@angular/router';
import { asyncScheduler, debounceTime, distinctUntilChanged, observeOn, takeUntil } from 'rxjs';
import { filterNil } from '@util/operators/filter';
import { Control } from '@stlmpp/control';
import { FilterItemDirective } from '@shared/filter/filter-item.directive';

@Component({
    selector: 'bio-faq',
    templateUrl: './faq.component.html',
    styleUrls: ['./faq.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false
})
export class FaqComponent extends Destroyable implements AfterViewInit {
  constructor(
    private breakpointObserverService: BreakpointObserverService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {
    super();
  }

  @ViewChild(AccordionDirective) readonly accordionDirective?: AccordionDirective;

  readonly isMobile$ = this.breakpointObserverService.isMobile$;
  readonly searchControl = new Control<string>('', { initialFocus: true });
  readonly search$ = this.searchControl.value$.pipe(debounceTime(400), distinctUntilChanged());

  onItemExpanded($event: string): void {
    this.router.navigate([], { relativeTo: this.activatedRoute, fragment: $event }).then();
  }

  onFilterChange($event: FilterItemDirective[]): void {
    if ($event.length === 1 && this.accordionDirective) {
      this.accordionDirective.expandItem($event[0].id + '');
    }
  }

  ngAfterViewInit(): void {
    let isFirstChange = true;
    this.activatedRoute.fragment
      .pipe(observeOn(asyncScheduler), takeUntil(this.destroy$), filterNil(), distinctUntilChanged())
      .subscribe(fragment => {
        if (isFirstChange) {
          this.accordionDirective?.focusItem(fragment);
        }
        this.accordionDirective?.expandItem(fragment);
        isFirstChange = false;
      });
  }
}
