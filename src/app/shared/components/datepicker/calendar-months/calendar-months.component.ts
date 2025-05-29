import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { CalendarKeyboardNavigation } from '@shared/components/datepicker/calendar-keyboard-navigation';
import { CalendarMonth } from '@shared/components/datepicker/calendar-month';

@Component({
    selector: 'bio-calendar-months',
    templateUrl: './calendar-months.component.html',
    styleUrls: ['./calendar-months.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [{ provide: CalendarKeyboardNavigation, useExisting: CalendarMonthsComponent }],
    standalone: false
})
export class CalendarMonthsComponent extends CalendarKeyboardNavigation {
  @Input() months: CalendarMonth[] = [];

  @Input()
  set value(value: Date | null | undefined) {
    this.valueMonth = (value ?? new Date()).getMonth();
  }

  @Input() disabled = false;

  @Output() readonly monthSelect = new EventEmitter<number>();
  @Output() readonly nextYear = new EventEmitter<void>();
  @Output() readonly previousYear = new EventEmitter<void>();

  readonly todayMonth = new Date().getMonth();
  readonly trackBy = CalendarMonth.trackBy;

  valueMonth = -1;

  handleArrowDown($event: KeyboardEvent): void {
    const activeIndex = this.focusKeyManager.activeItemIndex ?? 0;
    let nextIndex = activeIndex + 2;
    if (nextIndex > 11) {
      nextIndex -= 12;
      this.nextYear.emit();
    }
    this.focusKeyManager.setActiveItem(nextIndex);
  }

  handleArrowUp($event: KeyboardEvent): void {
    const activeIndex = this.focusKeyManager.activeItemIndex ?? 0;
    let previousIndex = activeIndex - 2;
    if (previousIndex < 0) {
      previousIndex = 12 - Math.abs(previousIndex);
      this.previousYear.emit();
    }
    this.focusKeyManager.setActiveItem(previousIndex);
  }

  handleArrowRight($event: KeyboardEvent): void {
    const activeIndex = this.focusKeyManager.activeItemIndex ?? 0;
    let nextIndex = activeIndex + 1;
    if (nextIndex === 12) {
      this.nextYear.emit();
      nextIndex = 0;
    }
    this.focusKeyManager.setActiveItem(nextIndex);
  }

  handleArrowLeft($event: KeyboardEvent): void {
    const activeIndex = this.focusKeyManager.activeItemIndex ?? 0;
    let previousIndex = activeIndex - 1;
    if (previousIndex === -1) {
      this.previousYear.emit();
      previousIndex = 11;
    }
    this.focusKeyManager.setActiveItem(previousIndex);
  }

  handleEnter($event: KeyboardEvent): void {
    const activeIndex = this.focusKeyManager.activeItemIndex ?? -1;
    const item = this.months[activeIndex];
    if (item) {
      this.monthSelect.emit(item.month);
    }
  }

  handlePageDown($event: KeyboardEvent): void {
    this.nextYear.emit();
  }

  handlePageUp($event: KeyboardEvent): void {
    this.previousYear.emit();
  }
}
