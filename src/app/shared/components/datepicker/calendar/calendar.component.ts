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
import { addMonths, addYears, subMonths, subYears } from 'date-fns';
import { distinctUntilChanged, map } from 'rxjs/operators';
import { getDayNames, getDaysArray, getMonths } from '@shared/components/datepicker/utils';
import { CalendarViewModeEnum } from '@shared/components/datepicker/calendar/calendar';
import { DATEPICKER_LOCALE } from '@shared/components/datepicker/datepicker';
import { combineLatest } from 'rxjs';

interface CalendarComponentState {
  date: Date;
  viewMode: CalendarViewModeEnum;
  locale: string;
}

@Component({
  selector: 'bio-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CalendarComponent extends LocalState<CalendarComponentState> implements OnInit {
  constructor(@Inject(LOCALE_ID) localeId: string, @Optional() @Inject(DATEPICKER_LOCALE) locale?: string) {
    super(
      { date: new Date(), viewMode: CalendarViewModeEnum.day, locale: locale ?? localeId },
      { inputs: ['viewMode', 'locale'] }
    );
  }

  @Input() value: Date | null | undefined;
  @Input() viewMode: CalendarViewModeEnum = CalendarViewModeEnum.day;
  @Input() locale = this.getState('locale');
  @Output() readonly valueChange = new EventEmitter<Date | null | undefined>();

  calendarViewModeEnum = CalendarViewModeEnum;

  locale$ = this.selectState('locale');
  viewMode$ = this.selectState('viewMode');
  date$ = this.selectState('date');
  days$ = this.date$.pipe(map(getDaysArray));
  years$ = this.date$.pipe(
    map(date => {
      let year = date.getFullYear();
      return Array.from({ length: 24 }, () => year++);
    })
  );
  months$ = this.locale$.pipe(map(getMonths));
  dayNames$ = this.locale$.pipe(map(getDayNames));
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

  next(): void {
    this.updateState('date', date => {
      switch (this.viewMode) {
        case CalendarViewModeEnum.day:
          return addMonths(date, 1);
        case CalendarViewModeEnum.month:
          return addYears(date, 1);
        default:
          return addYears(date, 23);
      }
    });
  }

  previous(): void {
    this.updateState('date', date => {
      switch (this.viewMode) {
        case CalendarViewModeEnum.day:
          return subMonths(date, 1);
        case CalendarViewModeEnum.month:
          return subYears(date, 1);
        default:
          return subYears(date, 23);
      }
    });
  }

  ngOnInit(): void {
    if (this.value) {
      this.updateState({ date: this.value });
    }
  }
}
