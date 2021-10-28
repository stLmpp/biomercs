import {
  ChangeDetectionStrategy,
  Component,
  ContentChild,
  EventEmitter,
  HostBinding,
  HostListener,
  Inject,
  Input,
  LOCALE_ID,
  OnInit,
  Optional,
  Output,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { LocalState } from '@stlmpp/store';
import { addMonths, addYears, setMonth, setYear, subMonths, subYears } from 'date-fns';
import { combineLatest, distinctUntilChanged, map, Subject } from 'rxjs';
import { CalendarViewModeEnum } from '@shared/components/datepicker/calendar-view-mode.enum';
import { CalendarAdapter } from '@shared/components/datepicker/calendar-adapter';
import { Key } from '@model/enum/key';
import { BooleanInput, coerceBooleanProperty } from 'st-utils';
import { ControlState, ControlValue } from '@stlmpp/control';
import { CalendarKeyboardNavigation } from '@shared/components/datepicker/calendar-keyboard-navigation';
import { CALENDAR_LOCALE } from '@shared/components/datepicker/calendar-locale.token';
import { CalendarFooterDirective } from '@shared/components/datepicker/calendar/calendar-footer.directive';

interface CalendarComponentState {
  date: Date;
  viewMode: CalendarViewModeEnum;
  locale: string;
  value: Date | null | undefined;
}

@Component({
  selector: 'bio-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: { class: 'bio-calendar' },
  providers: [{ provide: ControlValue, useExisting: CalendarComponent, multi: true }],
})
export class CalendarComponent
  extends LocalState<CalendarComponentState>
  implements OnInit, ControlValue<Date | null | undefined>
{
  constructor(
    private readonly calendarAdapter: CalendarAdapter,
    @Inject(LOCALE_ID) localeId: string,
    @Optional() @Inject(CALENDAR_LOCALE) locale?: string
  ) {
    super(
      { date: new Date(), viewMode: CalendarViewModeEnum.day, locale: locale ?? localeId, value: null },
      { inputs: ['viewMode', 'locale', 'value'] }
    );
  }

  private _disabled = false;

  @ViewChild(CalendarKeyboardNavigation) readonly calendarKeyboardNavigation!: CalendarKeyboardNavigation;
  @ContentChild(CalendarFooterDirective) readonly calendarFooterDirective?: CalendarFooterDirective;

  @Input() value: Date | null | undefined;
  @Input() viewMode: CalendarViewModeEnum = CalendarViewModeEnum.day;
  @Input() locale = this.getState('locale');
  @Output() readonly valueChange = new EventEmitter<Date | null | undefined>();
  @Output() readonly viewModeChange = new EventEmitter<CalendarViewModeEnum>();

  @Input()
  @HostBinding('attr.aria-disabled')
  get disabled(): boolean {
    return this._disabled;
  }
  set disabled(disabled: boolean) {
    this._disabled = coerceBooleanProperty(disabled);
  }

  @HostBinding('attr.tabindex')
  get tabIndex(): number {
    return this._disabled ? -1 : 0;
  }

  readonly viewModeDay = CalendarViewModeEnum.day;
  readonly viewModeMonth = CalendarViewModeEnum.month;
  readonly viewModeYear = CalendarViewModeEnum.year;

  readonly locale$ = this.selectState('locale');
  readonly viewMode$ = this.selectState('viewMode');
  readonly date$ = this.selectState('date');
  readonly days$ = this.date$.pipe(map(date => this.calendarAdapter.getDaysCalendar(date)));
  readonly years$ = this.date$.pipe(map(date => this.calendarAdapter.getYearsCalendar(date)));
  readonly months$ = this.locale$.pipe(map(locale => this.calendarAdapter.getMonthsCalendar(locale)));
  readonly dayNames$ = this.locale$.pipe(map(locale => this.calendarAdapter.getDayNames(locale)));
  readonly day$ = combineLatest([this.locale$, this.selectState('value'), this.date$]).pipe(
    map(([locale, value, date]) => new Intl.DateTimeFormat(locale, { day: '2-digit' }).format(value ?? date)),
    distinctUntilChanged()
  );
  readonly month$ = combineLatest([this.locale$, this.date$]).pipe(
    map(([locale, date]) => new Intl.DateTimeFormat(locale, { month: 'short' }).format(date)),
    distinctUntilChanged()
  );
  readonly year$ = this.date$.pipe(
    map(date => date.getFullYear()),
    distinctUntilChanged()
  );

  readonly onChange$ = new Subject<Date | null | undefined>();
  readonly onTouched$ = new Subject<void>();

  private _handleArrowRight(): void {
    switch (this.getState('viewMode')) {
      case CalendarViewModeEnum.day:
        this.changeViewModel(CalendarViewModeEnum.month);
        break;
      case CalendarViewModeEnum.month:
        this.changeViewModel(CalendarViewModeEnum.year);
        break;
      case CalendarViewModeEnum.year:
        this.changeViewModel(CalendarViewModeEnum.day);
        break;
    }
  }

  private _handleArrowLeft(): void {
    switch (this.getState('viewMode')) {
      case CalendarViewModeEnum.day:
        this.changeViewModel(CalendarViewModeEnum.year);
        break;
      case CalendarViewModeEnum.month:
        this.changeViewModel(CalendarViewModeEnum.day);
        break;
      case CalendarViewModeEnum.year:
        this.changeViewModel(CalendarViewModeEnum.month);
        break;
    }
  }

  @HostListener('keydown', ['$event'])
  onKeydown($event: KeyboardEvent): void {
    switch ($event.key) {
      case Key.ArrowLeft: {
        if ($event.ctrlKey) {
          this._handleArrowLeft();
        }
        break;
      }
      case Key.ArrowRight: {
        if ($event.ctrlKey) {
          this._handleArrowRight();
        }
        break;
      }
      case Key.ArrowDown: {
        this.focus();
        break;
      }
    }
  }

  @HostListener('blur')
  @HostListener('focusout')
  onBlur(): void {
    // FIXME this is not correct, but will work for now
    this.onTouched$.next();
  }

  next(viewMode?: CalendarViewModeEnum): void {
    viewMode ??= this.getState('viewMode');
    this.updateState('date', date => {
      switch (viewMode) {
        case CalendarViewModeEnum.day:
          return addMonths(date, 1);
        case CalendarViewModeEnum.month:
          return addYears(date, 1);
        default:
          return addYears(date, 24);
      }
    });
  }

  previous(viewMode?: CalendarViewModeEnum): void {
    viewMode ??= this.getState('viewMode');
    this.updateState('date', date => {
      switch (viewMode) {
        case CalendarViewModeEnum.day:
          return subMonths(date, 1);
        case CalendarViewModeEnum.month:
          return subYears(date, 1);
        default:
          return subYears(date, 24);
      }
    });
  }

  changeViewModel(viewMode: CalendarViewModeEnum): void {
    this.updateState({ viewMode });
    this.viewModeChange.emit(viewMode);
  }

  onDaySelect($event: Date | null | undefined): void {
    this.value = $event;
    this.valueChange.emit(this.value);
    this.updateState(state => ({ ...state, date: $event ?? state.date, value: $event }));
    this.onChange$.next(this.value);
  }

  onMonthSelect($event: number): void {
    this.updateState(state => ({ ...state, viewMode: CalendarViewModeEnum.day, date: setMonth(state.date, $event) }));
  }

  onYearSelect($event: number): void {
    this.updateState(state => ({ ...state, viewMode: CalendarViewModeEnum.day, date: setYear(state.date, $event) }));
  }

  setValue(date: Date | null | undefined): void {
    this.value = date;
    this.valueChange.emit(this.value);
    this.updateState(state => ({ ...state, value: date, date: date ?? state.date }));
  }

  focus(): void {
    this.calendarKeyboardNavigation.focusKeyManager.setFirstItemActive();
  }

  setDisabled(disabled: boolean): void {
    this.disabled = disabled;
  }

  stateChanged(state: ControlState): void {}

  ngOnInit(): void {
    if (this.value) {
      this.updateState({ date: this.value });
    }
  }

  static ngAcceptInputType_disabled: BooleanInput;
}
