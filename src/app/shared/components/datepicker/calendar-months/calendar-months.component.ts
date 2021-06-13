import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { trackByFactory } from '@stlmpp/utils';

@Component({
  selector: 'bio-calendar-months',
  templateUrl: './calendar-months.component.html',
  styleUrls: ['./calendar-months.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CalendarMonthsComponent {
  @Input() months: string[] = [];

  trackByString = trackByFactory<string>();
}
