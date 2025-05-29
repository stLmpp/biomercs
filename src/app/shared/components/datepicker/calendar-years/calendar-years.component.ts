import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, input } from '@angular/core';
import { CalendarKeyboardNavigation } from '@shared/components/datepicker/calendar-keyboard-navigation';
import { trackByFactory } from '@stlmpp/utils';
import { ButtonComponent } from '../../button/button.component';

@Component({
  selector: 'bio-calendar-years',
  templateUrl: './calendar-years.component.html',
  styleUrls: ['./calendar-years.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [{ provide: CalendarKeyboardNavigation, useExisting: CalendarYearsComponent }],
  imports: [ButtonComponent],
})
export class CalendarYearsComponent extends CalendarKeyboardNavigation {
  readonly years = input<number[]>([]);

  @Input()
  set value(value: Date | null | undefined) {
    this.valueYear = (value ?? new Date()).getFullYear();
  }

  readonly disabled = input(false);

  @Output() readonly nextYears = new EventEmitter<void>();
  @Output() readonly previousYears = new EventEmitter<void>();
  @Output() readonly yearSelect = new EventEmitter<number>();

  readonly todayYear = new Date().getFullYear();
  readonly trackBy = trackByFactory<number>();

  valueYear = -1;

  handleArrowDown($event: KeyboardEvent): void {
    const activeIndex = this.focusKeyManager.activeItemIndex ?? 0;
    let nextIndex = activeIndex + 4;
    if (nextIndex > 23) {
      nextIndex -= 24;
      this.nextYears.emit();
    }
    this.focusKeyManager.setActiveItem(nextIndex);
  }

  handleArrowUp($event: KeyboardEvent): void {
    const activeIndex = this.focusKeyManager.activeItemIndex ?? 0;
    let previousIndex = activeIndex - 4;
    if (previousIndex < 0) {
      previousIndex = 24 - Math.abs(previousIndex);
      this.previousYears.emit();
    }
    this.focusKeyManager.setActiveItem(previousIndex);
  }

  handleArrowRight($event: KeyboardEvent): void {
    const activeIndex = this.focusKeyManager.activeItemIndex ?? 0;
    let nextIndex = activeIndex + 1;
    if (nextIndex === 24) {
      this.nextYears.emit();
      nextIndex = 0;
    }
    this.focusKeyManager.setActiveItem(nextIndex);
  }

  handleArrowLeft($event: KeyboardEvent): void {
    const activeIndex = this.focusKeyManager.activeItemIndex ?? 0;
    let previousIndex = activeIndex - 1;
    if (previousIndex === -1) {
      this.previousYears.emit();
      previousIndex = 23;
    }
    this.focusKeyManager.setActiveItem(previousIndex);
  }

  handleEnter($event: KeyboardEvent): void {
    const activeIndex = this.focusKeyManager.activeItemIndex ?? -1;
    const years = this.years()[activeIndex];
    if (years) {
      this.yearSelect.emit(years);
    }
  }

  handlePageDown($event: KeyboardEvent): void {
    this.nextYears.emit();
  }

  handlePageUp($event: KeyboardEvent): void {
    this.previousYears.emit();
  }
}
