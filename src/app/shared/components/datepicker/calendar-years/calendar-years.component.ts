import { ChangeDetectionStrategy, Component, Input, input, output } from '@angular/core';
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

  readonly nextYears = output<void>();
  readonly previousYears = output<void>();
  readonly yearSelect = output<number>();

  readonly todayYear = new Date().getFullYear();
  readonly trackBy = trackByFactory<number>();

  valueYear = -1;

  handleArrowDown($event: KeyboardEvent): void {
    const activeIndex = this.focusKeyManager.activeItemIndex ?? 0;
    let nextIndex = activeIndex + 4;
    if (nextIndex > 23) {
      nextIndex -= 24;
      // TODO: The 'emit' function requires a mandatory void argument
      this.nextYears.emit();
    }
    this.focusKeyManager.setActiveItem(nextIndex);
  }

  handleArrowUp($event: KeyboardEvent): void {
    const activeIndex = this.focusKeyManager.activeItemIndex ?? 0;
    let previousIndex = activeIndex - 4;
    if (previousIndex < 0) {
      previousIndex = 24 - Math.abs(previousIndex);
      // TODO: The 'emit' function requires a mandatory void argument
      this.previousYears.emit();
    }
    this.focusKeyManager.setActiveItem(previousIndex);
  }

  handleArrowRight($event: KeyboardEvent): void {
    const activeIndex = this.focusKeyManager.activeItemIndex ?? 0;
    let nextIndex = activeIndex + 1;
    if (nextIndex === 24) {
      // TODO: The 'emit' function requires a mandatory void argument
      this.nextYears.emit();
      nextIndex = 0;
    }
    this.focusKeyManager.setActiveItem(nextIndex);
  }

  handleArrowLeft($event: KeyboardEvent): void {
    const activeIndex = this.focusKeyManager.activeItemIndex ?? 0;
    let previousIndex = activeIndex - 1;
    if (previousIndex === -1) {
      // TODO: The 'emit' function requires a mandatory void argument
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
    // TODO: The 'emit' function requires a mandatory void argument
    this.nextYears.emit();
  }

  handlePageUp($event: KeyboardEvent): void {
    // TODO: The 'emit' function requires a mandatory void argument
    this.previousYears.emit();
  }
}
