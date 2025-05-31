import { ChangeDetectionStrategy, Component, Input, input, output } from '@angular/core';
import { CalendarKeyboardNavigation } from '@shared/components/datepicker/calendar-keyboard-navigation';
import { CalendarMonth } from '@shared/components/datepicker/calendar-month';
import { ButtonComponent } from '../../button/button.component';

@Component({
  selector: 'bio-calendar-months',
  templateUrl: './calendar-months.component.html',
  styleUrls: ['./calendar-months.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [{ provide: CalendarKeyboardNavigation, useExisting: CalendarMonthsComponent }],
  imports: [ButtonComponent],
})
export class CalendarMonthsComponent extends CalendarKeyboardNavigation {
  readonly months = input<CalendarMonth[]>([]);

  @Input()
  set value(value: Date | null | undefined) {
    this.valueMonth = (value ?? new Date()).getMonth();
  }

  readonly disabled = input(false);

  readonly monthSelect = output<number>();
  readonly nextYear = output<void>();
  readonly previousYear = output<void>();

  readonly todayMonth = new Date().getMonth();
  readonly trackBy = CalendarMonth.trackBy;

  valueMonth = -1;

  handleArrowDown($event: KeyboardEvent): void {
    const activeIndex = this.focusKeyManager.activeItemIndex ?? 0;
    let nextIndex = activeIndex + 2;
    if (nextIndex > 11) {
      nextIndex -= 12;
      // TODO: The 'emit' function requires a mandatory void argument
      this.nextYear.emit();
    }
    this.focusKeyManager.setActiveItem(nextIndex);
  }

  handleArrowUp($event: KeyboardEvent): void {
    const activeIndex = this.focusKeyManager.activeItemIndex ?? 0;
    let previousIndex = activeIndex - 2;
    if (previousIndex < 0) {
      previousIndex = 12 - Math.abs(previousIndex);
      // TODO: The 'emit' function requires a mandatory void argument
      this.previousYear.emit();
    }
    this.focusKeyManager.setActiveItem(previousIndex);
  }

  handleArrowRight($event: KeyboardEvent): void {
    const activeIndex = this.focusKeyManager.activeItemIndex ?? 0;
    let nextIndex = activeIndex + 1;
    if (nextIndex === 12) {
      // TODO: The 'emit' function requires a mandatory void argument
      this.nextYear.emit();
      nextIndex = 0;
    }
    this.focusKeyManager.setActiveItem(nextIndex);
  }

  handleArrowLeft($event: KeyboardEvent): void {
    const activeIndex = this.focusKeyManager.activeItemIndex ?? 0;
    let previousIndex = activeIndex - 1;
    if (previousIndex === -1) {
      // TODO: The 'emit' function requires a mandatory void argument
      this.previousYear.emit();
      previousIndex = 11;
    }
    this.focusKeyManager.setActiveItem(previousIndex);
  }

  handleEnter($event: KeyboardEvent): void {
    const activeIndex = this.focusKeyManager.activeItemIndex ?? -1;
    const item = this.months()[activeIndex];
    if (item) {
      this.monthSelect.emit(item.month);
    }
  }

  handlePageDown($event: KeyboardEvent): void {
    // TODO: The 'emit' function requires a mandatory void argument
    this.nextYear.emit();
  }

  handlePageUp($event: KeyboardEvent): void {
    // TODO: The 'emit' function requires a mandatory void argument
    this.previousYear.emit();
  }
}
