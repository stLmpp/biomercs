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
import { DatepickerMonth } from '@shared/components/datepicker/datepicker';
import { ButtonComponent } from '@shared/components/button/button.component';
import { FocusKeyManager } from '@angular/cdk/a11y';

@Component({
  selector: 'bio-calendar-months',
  templateUrl: './calendar-months.component.html',
  styleUrls: ['./calendar-months.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CalendarMonthsComponent implements AfterViewInit {
  @ViewChildren(ButtonComponent) buttons!: QueryList<ButtonComponent>;

  @Input() value: Date | null | undefined;
  @Input() months: DatepickerMonth[] = [];

  @Output() readonly monthSelect = new EventEmitter<number>();

  todayMonth = new Date().getMonth();
  focusKeyManager!: FocusKeyManager<ButtonComponent>;

  trackBy = DatepickerMonth.trackBy;

  private _handleArrowRight(): void {}

  private _handleArrowLeft(): void {}

  private _handleArrowDown(): void {}

  private _handleArrowUp(): void {}

  @HostListener('keydown', ['$event'])
  onKeydown($event: KeyboardEvent): void {
    switch ($event.key) {
    }
  }

  ngAfterViewInit(): void {
    this.focusKeyManager = new FocusKeyManager<ButtonComponent>(this.buttons);
    this.focusKeyManager.setFirstItemActive();
  }
}
