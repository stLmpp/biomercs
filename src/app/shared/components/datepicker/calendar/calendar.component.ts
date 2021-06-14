import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Inject,
  Input,
  LOCALE_ID,
  OnInit,
  Optional,
  Output,
} from '@angular/core';
import { LocalState } from '@stlmpp/store';
import { addMonths, addYears, setMonth, subMonths, subYears } from 'date-fns';
import { distinctUntilChanged, map } from 'rxjs/operators';
import { CalendarViewModeEnum } from '@shared/components/datepicker/calendar/calendar';
import { DATEPICKER_LOCALE } from '@shared/components/datepicker/datepicker';
import { combineLatest } from 'rxjs';
import { CalendarAdapter } from '@shared/components/datepicker/calendar-adapter';

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
})
export class CalendarComponent extends LocalState<CalendarComponentState> implements OnInit {
  constructor(
    private calendarAdapter: CalendarAdapter,
    @Inject(LOCALE_ID) localeId: string,
    @Optional() @Inject(DATEPICKER_LOCALE) locale?: string
  ) {
    super(
      { date: new Date(), viewMode: CalendarViewModeEnum.day, locale: locale ?? localeId, value: null },
      { inputs: ['viewMode', 'locale', 'value'] }
    );
  }

  @Input() value: Date | null | undefined;
  @Input() viewMode: CalendarViewModeEnum = CalendarViewModeEnum.day;
  @Input() locale = this.getState('locale');
  @Output() readonly valueChange = new EventEmitter<Date | null | undefined>();
  @Output() readonly viewModeChange = new EventEmitter<Date | null | undefined>();

  viewModeDay = CalendarViewModeEnum.day;
  viewModeMonth = CalendarViewModeEnum.month;
  viewModeYear = CalendarViewModeEnum.year;

  locale$ = this.selectState('locale');
  viewMode$ = this.selectState('viewMode');
  date$ = this.selectState('date');
  days$ = this.date$.pipe(map(date => this.calendarAdapter.getDaysCalendar(date)));
  years$ = this.date$.pipe(
    map(date => {
      let year = date.getFullYear();
      return Array.from({ length: 24 }, () => year++);
    })
  );
  months$ = this.locale$.pipe(map(locale => this.calendarAdapter.getMonthsCalendar(locale)));
  dayNames$ = this.locale$.pipe(map(locale => this.calendarAdapter.getDayNames(locale)));
  day$ = combineLatest([this.locale$, this.selectState('value'), this.date$]).pipe(
    map(([locale, value, date]) => new Intl.DateTimeFormat(locale, { day: '2-digit' }).format(value ?? date)),
    distinctUntilChanged()
  );
  month$ = combineLatest([this.locale$, this.date$]).pipe(
    map(([locale, date]) => new Intl.DateTimeFormat(locale, { month: 'short' }).format(date)),
    distinctUntilChanged()
  );
  monthNumber$ = this.date$.pipe(
    map(date => date.getMonth()),
    distinctUntilChanged()
  );
  year$ = this.date$.pipe(
    map(date => date.getFullYear()),
    distinctUntilChanged()
  );

  next(viewMode?: CalendarViewModeEnum): void {
    viewMode ??= this.getState('viewMode');
    this.updateState('date', date => {
      switch (viewMode) {
        case CalendarViewModeEnum.day:
          return addMonths(date, 1);
        case CalendarViewModeEnum.month:
          return addYears(date, 1);
        default:
          return addYears(date, 23);
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
          return subYears(date, 23);
      }
    });
  }

  changeViewModel(viewMode: CalendarViewModeEnum): void {
    this.updateState({ viewMode });
  }

  onMonthSelect($event: number): void {
    const stateUpdate: Partial<CalendarComponentState> = { viewMode: CalendarViewModeEnum.day };
    if (this.value) {
      this.value = setMonth(this.value, $event);
      this.valueChange.emit(this.value);
      stateUpdate.value = this.value;
    }
    this.updateState(state => ({ ...state, ...stateUpdate, date: setMonth(state.date, $event) }));
  }

  ngOnInit(): void {
    if (this.value) {
      this.updateState({ date: this.value });
    }
  }
}
