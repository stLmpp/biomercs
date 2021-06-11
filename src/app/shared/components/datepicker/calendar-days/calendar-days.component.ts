import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  HostListener,
  Input,
  Output,
  QueryList,
  ViewChildren,
} from '@angular/core';
import { DatepickerDay } from '@shared/components/datepicker/datepicker';
import { trackByFactory } from '@stlmpp/utils';
import { ButtonComponent } from '@shared/components/button/button.component';
import { FocusKeyManager } from '@angular/cdk/a11y';
import { Key } from '@model/enum/key';
import { isFirstDayOfMonth, isLastDayOfMonth } from 'date-fns';

@Component({
  selector: 'bio-calendar-days',
  templateUrl: './calendar-days.component.html',
  styleUrls: ['./calendar-days.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CalendarDaysComponent implements AfterViewInit {
  @ViewChildren(ButtonComponent) buttons!: QueryList<ButtonComponent>;

  @Input() value: Date | null | undefined;
  @Output() readonly valueChange = new EventEmitter<Date | null | undefined>();
  @Input() days: DatepickerDay[] = [];
  @Input() dayNames: string[] = [];

  @Output() readonly nextMonth = new EventEmitter<void>();
  @Output() readonly previousMonth = new EventEmitter<void>();

  focusKeyManager!: FocusKeyManager<ButtonComponent>;

  nowDate = new Date();

  trackByString = trackByFactory<string>();
  trackByDay = DatepickerDay.trackBy;

  private _handleArrayRight(): void {
    const activeItemIndex = this.focusKeyManager.activeItemIndex ?? 0;
    const item = this.days[activeItemIndex];
    if (isLastDayOfMonth(item.date)) {
      this.nextMonth.emit();
      setTimeout(() => {
        this.focusKeyManager.setFirstItemActive();
      });
    } else {
      this.focusKeyManager.setNextItemActive();
    }
  }

  private _handleArrowLeft(): void {
    const activeItemIndex = this.focusKeyManager.activeItemIndex ?? 0;
    const item = this.days[activeItemIndex];
    if (isFirstDayOfMonth(item.date)) {
      this.previousMonth.emit();
      setTimeout(() => {
        this.focusKeyManager.setLastItemActive();
      });
    } else {
      this.focusKeyManager.setPreviousItemActive();
    }
  }

  @HostListener('keydown', ['$event'])
  onKeydown($event: KeyboardEvent): void {
    switch ($event.key) {
      case Key.ArrowRight:
        this._handleArrayRight();
        break;
      case Key.ArrowLeft:
        this._handleArrowLeft();
        break;
    }
  }

  onClick(day: DatepickerDay, index: number): void {
    this.value = day.date;
    this.valueChange.emit(this.value);
    this.focusKeyManager.setActiveItem(index);
  }

  ngAfterViewInit(): void {
    this.focusKeyManager = new FocusKeyManager<ButtonComponent>(this.buttons);
    this.focusKeyManager.setFirstItemActive();
  }
}
