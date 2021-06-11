import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { DatepickerDay } from '@shared/components/datepicker/datepicker';
import { trackByFactory } from '@stlmpp/utils';

@Component({
  selector: 'bio-calendar-days',
  templateUrl: './calendar-days.component.html',
  styleUrls: ['./calendar-days.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CalendarDaysComponent {
  @Input() value: Date | null | undefined;
  @Output() readonly valueChange = new EventEmitter<Date | null | undefined>();
  @Input() days: DatepickerDay[] = [];
  @Input() dayNames: string[] = [];

  trackByString = trackByFactory<string>();
  trackByDay = DatepickerDay.trackBy;
}
