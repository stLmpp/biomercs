import { AfterViewInit, ChangeDetectionStrategy, Component, inject, viewChild } from '@angular/core';
import { BreakpointObserverService } from '@shared/services/breakpoint-observer/breakpoint-observer.service';
import { AccordionDirective } from '@shared/components/accordion/accordion.directive';
import { Destroyable } from '@shared/components/common/destroyable-component';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { asyncScheduler, debounceTime, distinctUntilChanged, observeOn, takeUntil } from 'rxjs';
import { filterNil } from '@util/operators/filter';
import { Control, StControlValueModule, StControlCommonModule, StControlModule } from '@stlmpp/control';
import { FilterItemDirective } from '@shared/filter/filter-item.directive';
import { PageTitleComponent } from '../shared/title/page-title.component';
import { FormFieldComponent } from '../shared/components/form/form-field.component';
import { InputDirective } from '../shared/components/form/input.directive';
import { IconComponent } from '../shared/components/icon/icon.component';
import { PrefixDirective } from '../shared/components/common/prefix.directive';
import { AccordionDirective as AccordionDirective_1 } from '../shared/components/accordion/accordion.directive';
import { FilterDirective } from '../shared/filter/filter.directive';
import { NgLetModule } from '@stlmpp/utils';
import { AccordionItemComponent } from '../shared/components/accordion/accordion-item.component';
import { FilterItemDirective as FilterItemDirective_1 } from '../shared/filter/filter-item.directive';
import { ButtonComponent } from '../shared/components/button/button.component';
import { TooltipDirective } from '../shared/components/tooltip/tooltip.directive';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'bio-faq',
  templateUrl: './faq.component.html',
  styleUrls: ['./faq.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    PageTitleComponent,
    FormFieldComponent,
    InputDirective,
    StControlValueModule,
    StControlCommonModule,
    StControlModule,
    IconComponent,
    PrefixDirective,
    AccordionDirective_1,
    FilterDirective,
    NgLetModule,
    AccordionItemComponent,
    FilterItemDirective_1,
    ButtonComponent,
    RouterLink,
    TooltipDirective,
    AsyncPipe,
  ],
})
export class FaqComponent extends Destroyable implements AfterViewInit {
  private breakpointObserverService = inject(BreakpointObserverService);
  private activatedRoute = inject(ActivatedRoute);
  private router = inject(Router);


  readonly accordionDirective = viewChild(AccordionDirective);

  readonly isMobile$ = this.breakpointObserverService.isMobile$;
  readonly searchControl = new Control<string>('', { initialFocus: true });
  readonly search$ = this.searchControl.value$.pipe(debounceTime(400), distinctUntilChanged());

  onItemExpanded($event: string): void {
    this.router.navigate([], { relativeTo: this.activatedRoute, fragment: $event }).then();
  }

  onFilterChange($event: FilterItemDirective[]): void {
    const accordionDirective = this.accordionDirective();
    if ($event.length === 1 && accordionDirective) {
      accordionDirective.expandItem($event[0].id() + '');
    }
  }

  ngAfterViewInit(): void {
    let isFirstChange = true;
    this.activatedRoute.fragment
      .pipe(observeOn(asyncScheduler), takeUntil(this.destroy$), filterNil(), distinctUntilChanged())
      .subscribe(fragment => {
        if (isFirstChange) {
          this.accordionDirective()?.focusItem(fragment);
        }
        this.accordionDirective()?.expandItem(fragment);
        isFirstChange = false;
      });
  }
}
