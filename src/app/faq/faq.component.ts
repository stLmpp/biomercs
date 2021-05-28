import { AfterViewInit, ChangeDetectionStrategy, Component, ViewChild } from '@angular/core';
import { BreakpointObserverService } from '@shared/services/breakpoint-observer/breakpoint-observer.service';
import { AccordionDirective } from '@shared/components/accordion/accordion.directive';
import { Destroyable } from '@shared/components/common/destroyable-component';
import { ActivatedRoute, Router } from '@angular/router';
import { debounceTime, distinctUntilChanged, observeOn, takeUntil } from 'rxjs/operators';
import { filterNil } from '@shared/operators/filter';
import { asyncScheduler } from 'rxjs';
import { Control } from '@stlmpp/control';
import { FilterItemDirective } from '@shared/filter/filter-item.directive';

@Component({
  selector: 'bio-faq',
  templateUrl: './faq.component.html',
  styleUrls: ['./faq.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FaqComponent extends Destroyable implements AfterViewInit {
  constructor(
    private breakpointObserverService: BreakpointObserverService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {
    super();
  }

  @ViewChild(AccordionDirective) accordionDirective!: AccordionDirective;

  isMobile$ = this.breakpointObserverService.isMobile$;
  searchControl = new Control<string>('', { initialFocus: true });
  search$ = this.searchControl.value$.pipe(debounceTime(400), distinctUntilChanged());

  onItemExpanded($event: string): void {
    this.router.navigate([], { relativeTo: this.activatedRoute, fragment: $event }).then();
  }

  onFilterChange($event: FilterItemDirective[]): void {
    if ($event.length === 1) {
      this.accordionDirective.expandItem($event[0].id + '');
    }
  }

  ngAfterViewInit(): void {
    this.activatedRoute.fragment
      .pipe(observeOn(asyncScheduler), takeUntil(this.destroy$), filterNil(), distinctUntilChanged())
      .subscribe(fragment => {
        this.accordionDirective.expandItem(fragment);
      });
  }
}
